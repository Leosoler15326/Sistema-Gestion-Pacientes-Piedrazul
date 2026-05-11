package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.*;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.*;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final ProfesionalRepository profesionalRepository;
    private final PacienteRepository pacienteRepository;
    private final DisponibilidadService disponibilidadService;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;
    private final ConfiguracionAgendamientoService configuracionAgendamientoService;

    public CitaService(CitaRepository citaRepository,
                       ProfesionalRepository profesionalRepository,
                       PacienteRepository pacienteRepository,
                       DisponibilidadService disponibilidadService,
                       AuditoriaService auditoriaService,
                       NotificacionService notificacionService,
                       ConfiguracionAgendamientoService configuracionAgendamientoService) {
        this.citaRepository = citaRepository;
        this.profesionalRepository = profesionalRepository;
        this.pacienteRepository = pacienteRepository;
        this.disponibilidadService = disponibilidadService;
        this.auditoriaService = auditoriaService;
        this.notificacionService = notificacionService;
        this.configuracionAgendamientoService = configuracionAgendamientoService;
    }

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
                    "El horario no está disponible o no coincide con las franjas del profesional.");
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

    @Transactional
    public CitaDTO.Response agendarDesdeContacto(CitaDTO.AgendarContactoRequest dto, Usuario creadoPor) {
        validarFechaDentroDeVentana(dto.getFechaHora());

        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        if (!disponibilidadService.esSlotValidoParaAgendar(profesional, dto.getFechaHora())) {
            throw new IllegalStateException(
                    "El horario no está disponible o no coincide con las franjas del profesional.");
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

        auditoriaService.registrar(TipoEvento.CITA_AGENDADA,
                "Cita (contacto) para documento " + paciente.getDocumento()
                        + " con " + profesional.getNombres() + " en " + dto.getFechaHora(),
                creadoPor != null ? creadoPor.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionCita(guardada);

        return toResponse(guardada);
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

    @Transactional
    public CitaDTO.Response reagendar(Long citaId, CitaDTO.ReagendarRequest dto,
                                      Usuario responsable) {
        validarFechaDentroDeVentana(dto.getNuevaFechaHora());
        Cita cita = buscarEntidadPorId(citaId);

        if (!disponibilidadService.esSlotValidoParaAgendar(
                cita.getProfesional(), dto.getNuevaFechaHora())) {
            throw new IllegalStateException(
                    "El nuevo horario no está disponible o no coincide con las franjas del profesional.");
        }

        HistorialCita historial = new HistorialCita();
        historial.setCita(cita);
        historial.setFechaAnterior(cita.getFechaHora());
        historial.setFechaNueva(dto.getNuevaFechaHora());
        historial.setMotivo(dto.getMotivo());
        historial.setResponsable(responsable);

        cita.setFechaHora(dto.getNuevaFechaHora());
        cita.setEstado(EstadoCita.REAGENDADA);
        Cita actualizada = citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_REAGENDADA,
                "Cita " + citaId + " reagendada a " + dto.getNuevaFechaHora(),
                responsable != null ? responsable.getNombreUsuario() : "sistema");

        notificacionService.enviarConfirmacionReagendamiento(actualizada);

        return toResponse(actualizada);
    }

    @Transactional
    public void cancelar(Long citaId, CitaDTO.CancelarRequest dto, Usuario responsable) {
        Cita cita = buscarEntidadPorId(citaId);
        cita.setEstado(EstadoCita.CANCELADA);
        citaRepository.save(cita);

        auditoriaService.registrar(TipoEvento.CITA_CANCELADA,
                "Cita " + citaId + " cancelada. Motivo: " + dto.getMotivo(),
                responsable != null ? responsable.getNombreUsuario() : "sistema");
    }

    @Transactional(readOnly = true)
    public CitaDTO.Response buscarPorId(Long id) {
        CitaDTO.Response r = toResponse(buscarEntidadPorId(id));
        asegurarVisibilidadCita(r);
        return r;
    }

    /** Uso interno (p. ej. historias clínicas) sin filtro de rol PACIENTE. */
    @Transactional(readOnly = true)
    public CitaDTO.Response obtenerResumenPorId(Long id) {
        return toResponse(buscarEntidadPorId(id));
    }

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
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarPorPaciente(Long pacienteId) {
        asegurarPuedeVerPaciente(pacienteId);
        return citaRepository.findByPacienteId(pacienteId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CitaDTO.Response> listarMisCitasComoPaciente() {
        UserDetailsImpl u = SecurityUtils.getUsuarioActual();
        Paciente p = pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Debe completar su perfil de paciente."));
        return listarPorPaciente(p.getId());
    }

    @Transactional(readOnly = true)
    public byte[] exportarCsvProfesionalFecha(Long profesionalId, LocalDate fecha) {
        List<CitaDTO.Response> list = listarPorProfesionalYRangoFechas(
                profesionalId, fecha, fecha);
        StringBuilder sb = new StringBuilder("\uFEFF");
        sb.append("id;fechaHora;pacienteDocumento;pacienteNombre;profesional;especialidad;estado;tipoAtencion\n");
        for (CitaDTO.Response r : list) {
            sb.append(r.getId()).append(';')
                    .append(r.getFechaHora() != null ? r.getFechaHora().toString() : "").append(';')
                    .append(csvCampo(r.getPacienteDocumento())).append(';')
                    .append(csvCampo(r.getPacienteNombre())).append(';')
                    .append(csvCampo(r.getProfesionalNombre())).append(';')
                    .append(csvCampo(r.getEspecialidad())).append(';')
                    .append(csvCampo(r.getEstado())).append(';')
                    .append(csvCampo(r.getTipoAtencion())).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String csvCampo(String s) {
        if (s == null) {
            return "";
        }
        String t = s.replace("\"", "\"\"");
        return "\"" + t + "\"";
    }

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
