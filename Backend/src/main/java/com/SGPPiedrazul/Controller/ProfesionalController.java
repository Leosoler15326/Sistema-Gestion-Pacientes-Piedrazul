package com.SGPPiedrazul.Controller;

import com.SGPPiedrazul.dto.CrearProfesionalDTO;
import com.SGPPiedrazul.dto.ProfesionalResponseDTO;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.ProfesionalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    public ProfesionalController(ProfesionalService profesionalService) {
        this.profesionalService = profesionalService;
    }

    // ─── Listar todos ───
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<ProfesionalResponseDTO>> listar() {
        return ResponseEntity.ok(profesionalService.listarTodos());
    }

    // ─── Listar activos ───
    @GetMapping("/activos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<ProfesionalResponseDTO>> listarActivos() {
        return ResponseEntity.ok(profesionalService.listarActivos());
    }

    // ─── Listar por especialidad ───
    @GetMapping("/especialidad/{especialidad}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<ProfesionalResponseDTO>> listarPorEspecialidad(
            @PathVariable Especialidad especialidad) {
        return ResponseEntity.ok(profesionalService.listarPorEspecialidad(especialidad));
    }

    // ─── Buscar por ID ───
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<ProfesionalResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.buscarPorIdDTO(id));
    }

    // ─── Perfil del médico autenticado (obtiene su propio profesional desde el JWT) ───
    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('MEDICO_TERAPISTA')")
    public ResponseEntity<ProfesionalResponseDTO> miPerfil() {
        Long usuarioId = SecurityUtils.getIdUsuarioActual();
        return ResponseEntity.ok(profesionalService.buscarPorUsuarioId(usuarioId));
    }

    // ─── Buscar por usuario_id  ───
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<ProfesionalResponseDTO> buscarPorUsuarioId(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(profesionalService.buscarPorUsuarioId(usuarioId));
    }

    // ─── Crear profesional (con o sin usuario en una sola transacción) ───
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProfesionalResponseDTO> crear(
            @Valid @RequestBody CrearProfesionalDTO dto) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(profesionalService.crear(dto, responsable));
    }

    // ─── Actualizar datos clínicos ───
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProfesionalResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CrearProfesionalDTO dto) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        return ResponseEntity.ok(profesionalService.actualizar(id, dto, responsable));
    }

    // ─── Cambiar estado activo/inactivo ───
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable Long id,
            @RequestParam Estado estado) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        profesionalService.cambiarEstado(id, estado, responsable);
        return ResponseEntity.noContent().build();
    }

    // ─── Listar franjas horarias de un profesional ───
    @GetMapping("/{id}/franjas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<FranjaHoraria>> listarFranjas(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.listarFranjas(id));
    }

    // ─── Actualizar franjas horarias ───
    @PutMapping("/{id}/franjas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> actualizarFranjas(
            @PathVariable Long id,
            @RequestBody List<FranjaHoraria> franjas) {
        profesionalService.actualizarFranjas(id, franjas);
        return ResponseEntity.noContent().build();
    }
}