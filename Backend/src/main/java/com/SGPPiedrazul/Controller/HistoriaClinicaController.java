package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.HistoriaClinicaDTO;
import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.ProfesionalRepository;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.CitaService;
import com.SGPPiedrazul.service.HistoriaClinicaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historias")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','MEDICO_TERAPISTA')")
public class HistoriaClinicaController {

    private final HistoriaClinicaService historiaClinicaService;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;
    private final CitaService citaService;

    public HistoriaClinicaController(HistoriaClinicaService historiaClinicaService,
                                      UsuarioRepository usuarioRepository,
                                      ProfesionalRepository profesionalRepository,
                                      CitaService citaService) {
        this.historiaClinicaService = historiaClinicaService;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
        this.citaService = citaService;
    }

    @PostMapping
    public ResponseEntity<HistoriaClinicaDTO.Response> registrar(
            @Valid @RequestBody HistoriaClinicaDTO.Request dto) {

        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        Profesional profesional = profesionalRepository.findById(citaService.buscarPorId(dto.getCitaId()).getProfesionalId())
                                                .orElseThrow(() -> new RuntimeException("Profesional no encontrado."));

        return ResponseEntity.ok(
                historiaClinicaService.registrar(dto, profesional, responsable)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinicaDTO.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody HistoriaClinicaDTO.ActualizarRequest dto) {

        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        return ResponseEntity.ok(
                historiaClinicaService.actualizar(id, dto, responsable));
    }

    @GetMapping("/cita/{citaId}")
    public ResponseEntity<HistoriaClinicaDTO.Response> buscarPorCita(
            @PathVariable Long citaId) {
        return ResponseEntity.ok(historiaClinicaService.buscarPorCita(citaId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistoriaClinicaDTO.Response>> listarPorPaciente(
            @PathVariable Long pacienteId) {
        return ResponseEntity.ok(
                historiaClinicaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<HistoriaClinicaDTO.Response>> listarPorProfesional(
            @PathVariable Long profesionalId) {
        return ResponseEntity.ok(
                historiaClinicaService.listarPorProfesional(profesionalId));
    }
}