package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.CrearProfesionalDTO;
import com.SGPPiedrazul.dto.ProfesionalResponseDTO;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.ProfesionalService;
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

    @GetMapping
    public ResponseEntity<List<Profesional>> listar() {
        return ResponseEntity.ok(profesionalService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Profesional>> listarActivos() {
        return ResponseEntity.ok(profesionalService.listarActivos());
    }

    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<List<Profesional>> listarPorEspecialidad(
            @PathVariable Especialidad especialidad) {
        return ResponseEntity.ok(profesionalService.listarPorEspecialidad(especialidad));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profesional> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.buscarPorId(id));
    }

    // ─── Crear profesional (con o sin usuario en una sola llamada) ───
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProfesionalResponseDTO> crear(
            @RequestBody CrearProfesionalDTO dto) {

        String responsable = SecurityUtils.getNombreUsuarioActual();
        ProfesionalResponseDTO respuesta = profesionalService.crear(dto, responsable);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Profesional> actualizar(@PathVariable Long id,
                                                   @RequestBody Profesional datos) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        return ResponseEntity.ok(profesionalService.actualizar(id, datos, responsable));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id,
                                               @RequestParam Estado estado) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        profesionalService.cambiarEstado(id, estado, responsable);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/franjas")
    public ResponseEntity<List<FranjaHoraria>> listarFranjas(@PathVariable Long id) {
        return ResponseEntity.ok(profesionalService.listarFranjas(id));
    }

    @PutMapping("/{id}/franjas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> actualizarFranjas(@PathVariable Long id,
                                                   @RequestBody List<FranjaHoraria> franjas) {
        profesionalService.actualizarFranjas(id, franjas);
        return ResponseEntity.noContent().build();
    }
}