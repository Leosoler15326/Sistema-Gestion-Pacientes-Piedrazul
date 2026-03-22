package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.*;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final ProfesionalRepository profesionalRepository;
    private final PacienteRepository pacienteRepository;
    private final HistorialCitaRepository historialCitaRepository;
    private final DisponibilidadService disponibilidadService;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;

    public CitaService(CitaRepository citaRepository,
                       ProfesionalRepository profesionalRepository,
                       PacienteRepository pacienteRepository,
                       HistorialCitaRepository historialCitaRepository,
                       DisponibilidadService disponibilidadService,
                       AuditoriaService auditoriaService,
                       NotificacionService notificacionService) {
        this.citaRepository = citaRepository;
        this.profesionalRepository = profesionalRepository;
        this.pacienteRepository = pacienteRepository;
        this.historialCitaRepository = historialCitaRepository;
        this.disponibilidadService = disponibilidadService;
        this.auditoriaService = auditoriaService;
        this.notificacionService = notificacionService;
    }

     // ─── Agendar ───
    @Transactional
    public CitaDTO.Response agendar(CitaDTO.AgendarRequest dto, Usuario creadoPor) {
        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado."));

        if (!disponibilidadService.validarDisponibilidad(profesional, dto.getFechaHora())) {
            throw new IllegalStateException("El horario seleccionado ya no está disponible.");
        }

        Cita cita = new Cita();
        cita.setProfesional(profesional);
        cita.setPaciente(paciente);
        cita.setFechaHora(dto.getFechaHora());
        cita.setTipoAtencion(dto.getTipoAtencion());
        cita.setMotivoConsulta(dto.getMotivoConsulta());
        cita.setEstado(EstadoCita.PROGRAMADA);
        cita.setCreadoPor(creadoPor);

        Cita guardada = citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_AGENDADA,
                "Cita agendada para: " + paciente.getNombres()
                + " con " + profesional.getNombres()
                + " en " + dto.getFechaHora(),
                creadoPor != null ? creadoPor.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionCita(guardada);

        return toResponse(guardada);
    }

    // ─── Reagendar ───
    @Transactional
    public CitaDTO.Response reagendar(Long citaId, CitaDTO.ReagendarRequest dto,
                                       Usuario responsable) {
        Cita cita = buscarEntidadPorId(citaId);

        if (!disponibilidadService.validarDisponibilidad(
                cita.getProfesional(), dto.getNuevaFechaHora())) {
            throw new IllegalStateException("El nuevo horario no está disponible.");
        }

        HistorialCita historial = new HistorialCita();
        historial.setCita(cita);
        historial.setFechaAnterior(cita.getFechaHora());
        historial.setFechaNueva(dto.getNuevaFechaHora());
        historial.setMotivo(dto.getMotivo());
        historial.setResponsable(responsable);
        historialCitaRepository.save(historial);

        cita.setFechaHora(dto.getNuevaFechaHora());
        cita.setEstado(EstadoCita.REAGENDADA);
        Cita actualizada = citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_REAGENDADA,
                "Cita " + citaId + " reagendada a " + dto.getNuevaFechaHora(),
                responsable != null ? responsable.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionReagendamiento(actualizada);

        return toResponse(actualizada);
    }

    // ─── Cancelar ───
    @Transactional
    public void cancelar(Long citaId, CitaDTO.CancelarRequest dto, Usuario responsable) {
        Cita cita = buscarEntidadPorId(citaId);
        cita.setEstado(EstadoCita.CANCELADA);
        citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_CANCELADA,
                "Cita " + citaId + " cancelada. Motivo: " + dto.getMotivo(),
                responsable != null ? responsable.getNombreUsuario() : "sistema");
    }

    // ─── Consultas ───
    @Transactional(readOnly = true)
    public CitaDTO.Response buscarPorId(Long id) {
        return toResponse(buscarEntidadPorId(id));
    }

    @Transactional(readOnly = true)
    public List<CitaDTO.SlotResponse> obtenerSlots(Long profesionalId, LocalDate fecha) {
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));
        return disponibilidadService.calcularSlotsDisponibles(profesional, fecha)
                .stream()
                .map(CitaDTO.SlotResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarPorProfesionalYFecha(Long profesionalId,
                                                               LocalDate fecha) {
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));
        return citaRepository.findByProfesionalAndFechaHoraBetween(
                        profesional,
                        fecha.atStartOfDay(),
                        fecha.atTime(23, 59, 59))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Acceso interno ───
    public Cita buscarEntidadPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Cita no encontrada con id: " + id));
    }

    // ─── Mapeo ───
    private CitaDTO.Response toResponse(Cita c) {
        CitaDTO.Response dto = new CitaDTO.Response();
        dto.setId(c.getId());
        dto.setFechaHora(c.getFechaHora());
        dto.setEstado(c.getEstado().name());
        dto.setTipoAtencion(c.getTipoAtencion().name());
        dto.setMotivoConsulta(c.getMotivoConsulta());

        if (c.getPaciente() != null) {
            dto.setPacienteId(c.getPaciente().getId());
            dto.setPacienteNombre(c.getPaciente().getNombres()
                    + " " + c.getPaciente().getApellidos());
            dto.setPacienteDocumento(c.getPaciente().getDocumento());
        }

        if (c.getProfesional() != null) {
            dto.setProfesionalId(c.getProfesional().getId());
            dto.setProfesionalNombre(c.getProfesional().getNombres());
            dto.setEspecialidad(c.getProfesional().getEspecialidad().name());
        }

        if (c.getCreadoPor() != null) {
            dto.setCreadoPor(c.getCreadoPor().getNombreUsuario());
        }

        return dto;
    }

}
