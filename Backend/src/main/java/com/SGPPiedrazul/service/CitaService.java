package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.event.CitaAgendadaEvent;
import com.SGPPiedrazul.event.CitaCanceladaEvent;
import com.SGPPiedrazul.event.CitaReagendadaEvent;
import com.SGPPiedrazul.model.*;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.repository.*;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsImpl;
import com.SGPPiedrazul.service.cita.CitaEntityMapper;
import com.SGPPiedrazul.service.export.CitaListExporter;
import com.SGPPiedrazul.service.export.PorMedicoCsvExporter;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService implements ICitaService {

    private final CitaRepository citaRepository;
    private final ProfesionalRepository profesionalRepository;
    private final PacienteRepository pacienteRepository;
    private final DisponibilidadService disponibilidadService;
    private final ConfiguracionAgendamientoService configuracionAgendamientoService;
    private final ApplicationEventPublisher eventPublisher;
    private final CitaEntityMapper citaEntityMapper;
    private final CitaListExporter citaListExporter;
    private final PorMedicoCsvExporter porMedicoCsvExporter;

    public CitaService(CitaRepository citaRepository,
                       ProfesionalRepository profesionalRepository,
                       PacienteRepository pacienteRepository,
                       DisponibilidadService disponibilidadService,
                       ConfiguracionAgendamientoService configuracionAgendamientoService,
                       ApplicationEventPublisher eventPublisher,
                       CitaEntityMapper citaEntityMapper,
                       CitaListExporter citaListExporter,
                       PorMedicoCsvExporter porMedicoCsvExporter) {
        this.citaRepository = citaRepository;
        this.profesionalRepository = profesionalRepository;
        this.pacienteRepository = pacienteRepository;
        this.disponibilidadService = disponibilidadService;
        this.configuracionAgendamientoService = configuracionAgendamientoService;
        this.eventPublisher = eventPublisher;
        this.citaEntityMapper = citaEntityMapper;
        this.citaListExporter = citaListExporter;
        this.porMedicoCsvExporter = porMedicoCsvExporter;
    }

    @Override
    @Transactional
    public CitaDTO.Response agendar(CitaDTO.AgendarRequest dto, Usuario creadoPor) {
        asegurarAutorizacionPaciente(dto.getPacienteId());
        validarFechaDentroDeVentana(dto.getFechaHora());

        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado."));

        if (!disponibilidadService.esSlotValidoParaAgendar(profesional, dto.getFechaHora())) {
            throw new IllegalStateException(
                    disponibilidadService.diagnosticarSlotNoDisponible(profesional, dto.getFechaHora()));
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

        String detalle = "Cita agendada para: " + paciente.getNombres()
                + " con " + profesional.getNombres()
                + " en " + dto.getFechaHora();
        String actor = creadoPor != null ? creadoPor.getNombreUsuario() : "sistema";
        eventPublisher.publishEvent(new CitaAgendadaEvent(guardada, detalle, actor));

        return citaEntityMapper.toResponse(guardada);
    }

    @Override
    @Transactional
    public CitaDTO.Response agendarDesdeContacto(CitaDTO.AgendarContactoRequest dto, Usuario creadoPor) {
        validarFechaDentroDeVentana(dto.getFechaHora());

        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        if (!disponibilidadService.esSlotValidoParaAgendar(profesional, dto.getFechaHora())) {
            throw new IllegalStateException(
                    disponibilidadService.diagnosticarSlotNoDisponible(profesional, dto.getFechaHora()));
        }

        Paciente paciente = upsertPacienteDesdeContacto(dto.getPaciente());

        Cita cita = new Cita();
        cita.setProfesional(profesional);
        cita.setPaciente(paciente);
        cita.setFechaHora(dto.getFechaHora());
        cita.setTipoAtencion(dto.getTipoAtencion());
        cita.setMotivoConsulta(dto.getMotivoConsulta());
        cita.setEstado(EstadoCita.PROGRAMADA);
        cita.setCreadoPor(creadoPor);

        Cita guardada = citaRepository.save(cita);

        String detalle = "Cita (contacto) para documento " + paciente.getDocumento()
                + " con " + profesional.getNombres() + " en " + dto.getFechaHora();
        String actor = creadoPor != null ? creadoPor.getNombreUsuario() : "sistema";
        eventPublisher.publishEvent(new CitaAgendadaEvent(guardada, detalle, actor));

        return citaEntityMapper.toResponse(guardada);
    }

    private Paciente upsertPacienteDesdeContacto(CitaDTO.PacienteContactoDTO dto) {
        String doc = dto.getDocumento().trim();
        return pacienteRepository.findByDocumento(doc).map(p -> {
            p.setNombres(dto.getNombres().trim());
            p.setApellidos(dto.getApellidos().trim());
            p.setTelefono(dto.getTelefono().trim());
            p.setGenero(dto.getGenero());
            p.setFechaNacimiento(dto.getFechaNacimiento());
            if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
                p.setEmail(dto.getEmail().trim());
            }
            return pacienteRepository.save(p);
        }).orElseGet(() -> {
            Paciente p = new Paciente();
            p.setDocumento(doc);
            p.setNombres(dto.getNombres().trim());
            p.setApellidos(dto.getApellidos().trim());
            p.setTelefono(dto.getTelefono().trim());
            p.setGenero(dto.getGenero());
            p.setFechaNacimiento(dto.getFechaNacimiento());
            if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
                p.setEmail(dto.getEmail().trim());
            }
            return pacienteRepository.save(p);
        });
    }

    @Override
    @Transactional
    public CitaDTO.Response reagendar(Long citaId, CitaDTO.ReagendarRequest dto,
                                      Usuario responsable) {
        validarFechaDentroDeVentana(dto.getNuevaFechaHora());
        Cita cita = buscarEntidadPorId(citaId);

        Profesional profesionalDestino = cita.getProfesional();
        if (dto.getNuevoProfesionalId() != null) {
            profesionalDestino = profesionalRepository.findById(dto.getNuevoProfesionalId())
                    .orElseThrow(() -> new RuntimeException("Profesional de destino no encontrado."));
        }

        if (!disponibilidadService.esSlotValidoParaAgendar(
                profesionalDestino, dto.getNuevaFechaHora())) {
            throw new IllegalStateException(
                    "El nuevo horario no está disponible para el profesional seleccionado.");
        }

        cita.setProfesional(profesionalDestino);

        HistorialCita historial = new HistorialCita();
        historial.setCita(cita);
        historial.setFechaAnterior(cita.getFechaHora());
        historial.setFechaNueva(dto.getNuevaFechaHora());
        historial.setMotivo(dto.getMotivo());
        historial.setResponsable(responsable);
        cita.getHistorial().add(historial);

        cita.setFechaHora(dto.getNuevaFechaHora());
        cita.setEstado(EstadoCita.REAGENDADA);
        Cita actualizada = citaRepository.save(cita);

        String detalle = "Cita " + citaId + " reagendada a " + dto.getNuevaFechaHora();
        String actor = responsable != null ? responsable.getNombreUsuario() : "sistema";
        eventPublisher.publishEvent(new CitaReagendadaEvent(actualizada, detalle, actor));

        return citaEntityMapper.toResponse(actualizada);
    }

    @Override
    @Transactional
    public void cancelar(Long citaId, CitaDTO.CancelarRequest dto, Usuario responsable) {
        Cita cita = buscarEntidadPorId(citaId);
        cita.setEstado(EstadoCita.CANCELADA);
        citaRepository.save(cita);

        String actor = responsable != null ? responsable.getNombreUsuario() : "sistema";
        String motivo = dto.getMotivo() != null && !dto.getMotivo().isBlank()
                ? dto.getMotivo()
                : "(sin motivo)";
        eventPublisher.publishEvent(new CitaCanceladaEvent(citaId, motivo, actor));
    }

    @Override
    @Transactional
    public CitaDTO.Response cambiarEstado(Long citaId, CitaDTO.CambiarEstadoRequest dto,
                                          Usuario responsable) {
        Cita cita = buscarEntidadPorId(citaId);

        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new IllegalStateException("No se puede cambiar el estado de una cita ya cancelada.");
        }

        cita.setEstado(dto.getEstado());
        Cita actualizada = citaRepository.save(cita);
        return citaEntityMapper.toResponse(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public CitaDTO.Response buscarPorId(Long id) {
        CitaDTO.Response r = citaEntityMapper.toResponse(buscarEntidadPorId(id));
        asegurarVisibilidadCita(r);
        return r;
    }

    @Override
    @Transactional(readOnly = true)
    public CitaDTO.Response obtenerResumenPorId(Long id) {
        return citaEntityMapper.toResponse(buscarEntidadPorId(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaDTO.SlotResponse> obtenerSlots(Long profesionalId, LocalDate fecha) {
        validarDiaDentroDeVentana(fecha);
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));
        return disponibilidadService.calcularSlotsDisponibles(profesional, fecha)
                .stream()
                .map(CitaDTO.SlotResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarPorProfesionalYRangoFechas(
            Long profesionalId,
            LocalDate fechaInicio,
            LocalDate fechaFin) {

        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        return citaRepository.findByProfesionalAndFechaHoraBetween(
                        profesional,
                        fechaInicio.atStartOfDay(),
                        fechaFin.atTime(23, 59, 59))
                .stream()
                .map(citaEntityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarPorPaciente(Long pacienteId) {
        asegurarPuedeVerPaciente(pacienteId);
        return citaRepository.findByPacienteId(pacienteId)
                .stream()
                .map(citaEntityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarMisCitasComoPaciente() {
        UserDetailsImpl u = SecurityUtils.getUsuarioActual();
        Paciente p = pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Debe completar su perfil de paciente."));
        return listarPorPaciente(p.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportarCsvProfesionalFecha(Long profesionalId, LocalDate fecha) {
        List<CitaDTO.Response> list = listarPorProfesionalYRangoFechas(
                profesionalId, fecha, fecha);
        return citaListExporter.export(list);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportarCsvTodosFecha(LocalDate fecha) {
        List<CitaDTO.Response> list = citaRepository
                .findByFechaHoraBetweenOrderByProfesionalNombresAscFechaHoraAsc(
                        fecha.atStartOfDay(), fecha.atTime(23, 59, 59))
                .stream()
                .map(citaEntityMapper::toResponse)
                .collect(Collectors.toList());
        return porMedicoCsvExporter.export(list);
    }

    @Override
    public Cita buscarEntidadPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Cita no encontrada con id: " + id));
    }

    private void validarFechaDentroDeVentana(LocalDateTime fechaHora) {
        int semanas = configuracionAgendamientoService.getVentanaSemanasAgendar();
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusWeeks(semanas);
        LocalDate dia = fechaHora.toLocalDate();
        if (dia.isBefore(hoy)) {
            throw new IllegalArgumentException(
                    "La fecha de la cita no puede ser anterior al día actual.");
        }
        if (dia.isAfter(limite)) {
            throw new IllegalArgumentException(
                    "La fecha supera la ventana de agendamiento permitida (" + semanas + " semanas).");
        }
    }

    private void validarDiaDentroDeVentana(LocalDate fecha) {
        int semanas = configuracionAgendamientoService.getVentanaSemanasAgendar();
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusWeeks(semanas);
        if (fecha.isBefore(hoy)) {
            return;
        }
        if (fecha.isAfter(limite)) {
            throw new IllegalArgumentException(
                    "La fecha supera la ventana de agendamiento permitida (" + semanas + " semanas).");
        }
    }

    private void asegurarAutorizacionPaciente(Long pacienteId) {
        UserDetailsImpl u = SecurityUtils.getUsuarioActual();
        if (!"PACIENTE".equalsIgnoreCase(u.getRol())) {
            return;
        }
        Paciente p = pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Debe completar su perfil de paciente antes de agendar."));
        if (!p.getId().equals(pacienteId)) {
            throw new IllegalArgumentException("No puede agendar citas para otro paciente.");
        }
    }

    private void asegurarPuedeVerPaciente(Long pacienteId) {
        UserDetailsImpl u = SecurityUtils.getUsuarioActual();
        if (!"PACIENTE".equalsIgnoreCase(u.getRol())) {
            return;
        }
        Paciente p = pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new IllegalStateException("Perfil de paciente no encontrado."));
        if (!p.getId().equals(pacienteId)) {
            throw new RuntimeException("Paciente no encontrado con id: " + pacienteId);
        }
    }

    private void asegurarVisibilidadCita(CitaDTO.Response r) {
        UserDetailsImpl u = SecurityUtils.getUsuarioActual();
        if (!"PACIENTE".equalsIgnoreCase(u.getRol())) {
            return;
        }
        Paciente p = pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + r.getId()));
        if (r.getPacienteId() == null || !r.getPacienteId().equals(p.getId())) {
            throw new RuntimeException("Cita no encontrada con id: " + r.getId());
        }
    }
}
