package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.HistoriaClinicaDTO;
import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.HistoriaClinica;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.CitaRepository;
import com.SGPPiedrazul.repository.HistoriaClinicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoriaClinicaService {

    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final CitaRepository citaRepository;
    private final AuditoriaService auditoriaService;

    public HistoriaClinicaService(HistoriaClinicaRepository historiaClinicaRepository,
                                   CitaRepository citaRepository,
                                   AuditoriaService auditoriaService) {
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.citaRepository = citaRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public HistoriaClinicaDTO.Response registrar(HistoriaClinicaDTO.Request dto,
                                                   Profesional profesional,
                                                   Usuario responsable) {
        Cita cita = citaRepository.findById(dto.getCitaId())
                .orElseThrow(() -> new RuntimeException(
                        "Cita no encontrada con id: " + dto.getCitaId()));

        if (historiaClinicaRepository.existsByCitaId(dto.getCitaId())) {
            throw new IllegalStateException(
                    "Ya existe una historia clínica para esta cita.");
        }

        HistoriaClinica historia = new HistoriaClinica();
        historia.setCita(cita);
        historia.setProfesional(profesional);
        historia.setDescripcion(dto.getDescripcion());

        cita.setEstado(EstadoCita.ATENDIDA);
        citaRepository.save(cita);

        HistoriaClinica guardada = historiaClinicaRepository.save(historia);

        auditoriaService.registrar(TipoEvento.HISTORIA_REGISTRADA,
                "Historia clínica registrada para cita: " + dto.getCitaId(),
                responsable.getNombreUsuario());

        return toResponse(guardada);
    }

    @Transactional
    public HistoriaClinicaDTO.Response actualizar(Long historiaId,
                                                    HistoriaClinicaDTO.ActualizarRequest dto,
                                                    Usuario responsable) {
        HistoriaClinica historia = buscarEntidadPorId(historiaId);
        historia.setDescripcion(dto.getDescripcion());
        HistoriaClinica actualizada = historiaClinicaRepository.save(historia);

        auditoriaService.registrar(TipoEvento.HISTORIA_MODIFICADA,
                "Historia clínica " + historiaId + " modificada.",
                responsable.getNombreUsuario());

        return toResponse(actualizada);
    }

    @Transactional(readOnly = true)
    public HistoriaClinicaDTO.Response buscarPorCita(Long citaId) {
        return toResponse(historiaClinicaRepository.findByCitaId(citaId)
                .orElseThrow(() -> new RuntimeException(
                        "No hay historia clínica para la cita: " + citaId)));
    }

    @Transactional(readOnly = true)
    public List<HistoriaClinicaDTO.Response> listarPorPaciente(Long pacienteId) {
        return historiaClinicaRepository.findByCitaPacienteId(pacienteId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HistoriaClinicaDTO.Response> listarPorProfesional(Long profesionalId) {
        return historiaClinicaRepository.findByProfesionalId(profesionalId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public HistoriaClinica buscarEntidadPorId(Long id) {
        return historiaClinicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Historia clínica no encontrada con id: " + id));
    }

    private HistoriaClinicaDTO.Response toResponse(HistoriaClinica h) {
        HistoriaClinicaDTO.Response dto = new HistoriaClinicaDTO.Response();
        dto.setId(h.getId());
        dto.setFechaAtencion(h.getFechaAtencion());
        dto.setDescripcion(h.getDescripcion());

        if (h.getCita() != null) {
            dto.setCitaId(h.getCita().getId());
            dto.setFechaCita(h.getCita().getFechaHora());

            if (h.getCita().getPaciente() != null) {
                dto.setPacienteId(h.getCita().getPaciente().getId());
                dto.setPacienteNombre(h.getCita().getPaciente().getNombres()
                        + " " + h.getCita().getPaciente().getApellidos());
                dto.setPacienteDocumento(h.getCita().getPaciente().getDocumento());
            }
        }

        if (h.getProfesional() != null) {
            dto.setProfesionalId(h.getProfesional().getId());
            dto.setProfesionalNombre(h.getProfesional().getNombres());
            dto.setEspecialidad(h.getProfesional().getEspecialidad().name());
        }

        return dto;
    }
}