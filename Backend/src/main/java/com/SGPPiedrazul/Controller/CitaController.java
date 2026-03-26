package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
public class CitaController {

    private final CitaService citaService;
    private final UsuarioRepository usuarioRepository;

    public CitaController(CitaService citaService,
                          UsuarioRepository usuarioRepository) {
        this.citaService = citaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/slots")
    public ResponseEntity<List<CitaDTO.SlotResponse>> obtenerSlots(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.obtenerSlots(profesionalId, fecha));
    }

    @PostMapping
    public ResponseEntity<CitaDTO.Response> agendar(
            @Valid @RequestBody CitaDTO.AgendarRequest dto) {
        Usuario creadoPor = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaService.agendar(dto, creadoPor));
    }

    @PutMapping("/{id}/reagendar")
    public ResponseEntity<CitaDTO.Response> reagendar(
            @PathVariable Long id,
            @Valid @RequestBody CitaDTO.ReagendarRequest dto) {
        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.ok(citaService.reagendar(id, dto, responsable));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @RequestBody CitaDTO.CancelarRequest dto) {
        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        citaService.cancelar(id, dto, responsable);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profesional")
    public ResponseEntity<List<CitaDTO.Response>> listarPorProfesional(
        @RequestParam Long profesionalId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
            citaService.listarPorProfesionalYRangoFechas(profesionalId, fechaInicio, fechaFin)
        );
    }
    

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<CitaDTO.Response>> listarPorPaciente(
            @PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.buscarPorId(id));
    }
}