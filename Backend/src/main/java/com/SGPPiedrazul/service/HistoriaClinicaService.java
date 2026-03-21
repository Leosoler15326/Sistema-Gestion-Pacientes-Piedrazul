package com.SGPPiedrazul.service;

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
    public HistoriaClinica registrar(Long citaId, String descripcion,
                                      Profesional profesional, Usuario responsable) {

        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + citaId));

        if (historiaClinicaRepository.existsByCitaId(citaId)) {
            throw new IllegalStateException("Ya existe una historia clínica para esta cita.");
        }

        HistoriaClinica historia = new HistoriaClinica();
        historia.setCita(cita);
        historia.setProfesional(profesional);
        historia.setDescripcion(descripcion);

        // Marcar la cita como atendida
        cita.setEstado(EstadoCita.ATENDIDA);
        citaRepository.save(cita);

        HistoriaClinica guardada = historiaClinicaRepository.save(historia);

        auditoriaService.registrar(TipoEvento.HISTORIA_REGISTRADA,
                "Historia clínica registrada para cita: " + citaId,
                responsable.getNombreUsuario());

        return guardada;
    }

    @Transactional
    public HistoriaClinica actualizar(Long historiaId, String nuevaDescripcion, Usuario responsable) {
        HistoriaClinica historia = buscarPorId(historiaId);
        historia.setDescripcion(nuevaDescripcion);
        HistoriaClinica actualizada = historiaClinicaRepository.save(historia);

        auditoriaService.registrar(TipoEvento.HISTORIA_MODIFICADA,
                "Historia clínica " + historiaId + " modificada.",
                responsable.getNombreUsuario());

        return actualizada;
    }

    public HistoriaClinica buscarPorId(Long id) {
        return historiaClinicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historia clínica no encontrada con id: " + id));
    }

    public HistoriaClinica buscarPorCita(Long citaId) {
        return historiaClinicaRepository.findByCitaId(citaId)
                .orElseThrow(() -> new RuntimeException("No hay historia clínica para la cita: " + citaId));
    }

    public List<HistoriaClinica> listarPorPaciente(Long pacienteId) {
        return historiaClinicaRepository.findByCitaPacienteId(pacienteId);
    }

    public List<HistoriaClinica> listarPorProfesional(Long profesionalId) {
        return historiaClinicaRepository.findByProfesionalId(profesionalId);
    }
}
