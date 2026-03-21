package com.SGPPiedrazul.service;

import com.SGPPiedrazul.model.*;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional
    public Cita agendar(Long profesionalId, Long pacienteId, LocalDateTime fechaHora,
                        String tipoAtencion, String motivoConsulta, Usuario creadoPor) {

        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado."));

        if (!disponibilidadService.validarDisponibilidad(profesional, fechaHora)) {
            throw new IllegalStateException("El horario seleccionado ya no está disponible.");
        }

        Cita cita = new Cita();
        cita.setProfesional(profesional);
        cita.setPaciente(paciente);
        cita.setFechaHora(fechaHora);
        cita.setTipoAtencion(com.SGPPiedrazul.model.enums.TipoAtencion.valueOf(tipoAtencion));
        cita.setMotivoConsulta(motivoConsulta);
        cita.setEstado(EstadoCita.PROGRAMADA);
        cita.setCreadoPor(creadoPor);

        Cita guardada = citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_AGENDADA,
                "Cita agendada para paciente: " + paciente.getNombres() +
                " con " + profesional.getNombres() + " en " + fechaHora,
                creadoPor != null ? creadoPor.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionCita(guardada);

        return guardada;
    }

    @Transactional
    public Cita reagendar(Long citaId, LocalDateTime nuevaFechaHora,
                          String motivo, Usuario responsable) {

        Cita cita = buscarPorId(citaId);

        Profesional profesional = cita.getProfesional();

        if (!disponibilidadService.validarDisponibilidad(profesional, nuevaFechaHora)) {
            throw new IllegalStateException("El nuevo horario no está disponible.");
        }

        // Guardar en historial
        HistorialCita historial = new HistorialCita();
        historial.setCita(cita);
        historial.setFechaAnterior(cita.getFechaHora());
        historial.setFechaNueva(nuevaFechaHora);
        historial.setMotivo(motivo);
        historial.setResponsable(responsable);
        historialCitaRepository.save(historial);

        // Actualizar cita
        cita.setFechaHora(nuevaFechaHora);
        cita.setEstado(EstadoCita.REAGENDADA);
        Cita actualizada = citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_REAGENDADA,
                "Cita " + citaId + " reagendada a " + nuevaFechaHora + ". Motivo: " + motivo,
                responsable != null ? responsable.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionReagendamiento(actualizada);

        return actualizada;
    }

    @Transactional
    public void cancelar(Long citaId, String motivo, Usuario responsable) {
        Cita cita = buscarPorId(citaId);
        cita.setEstado(EstadoCita.CANCELADA);
        citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_CANCELADA,
                "Cita " + citaId + " cancelada. Motivo: " + motivo,
                responsable != null ? responsable.getNombreUsuario() : "sistema");
    }

    public List<LocalDateTime> obtenerSlotsDisponibles(Long profesionalId, LocalDate fecha) {
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));
        return disponibilidadService.calcularSlotsDisponibles(profesional, fecha);
    }

    public List<Cita> listarPorProfesionalYFecha(Long profesionalId, LocalDate fecha) {
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));
        return citaRepository.findByProfesionalAndFechaHoraBetween(
                profesional,
                fecha.atStartOfDay(),
                fecha.atTime(23, 59, 59)
        );
    }

    public List<Cita> listarPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId);
    }

    public Cita buscarPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }
}
