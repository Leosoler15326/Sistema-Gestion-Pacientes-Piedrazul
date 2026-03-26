package com.SGPPiedrazul.Controller;

import com.SGPPiedrazul.dto.UsuarioDTO;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO.Response>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<UsuarioDTO.Response>> listarActivos() {
        return ResponseEntity.ok(usuarioService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO.Response> crear(
            @Valid @RequestBody UsuarioDTO.Request dto) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.crear(dto, responsable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioDTO.ActualizarRequest dto) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        return ResponseEntity.ok(usuarioService.actualizar(id, dto, responsable));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        usuarioService.desactivar(id, responsable);
        return ResponseEntity.noContent().build();
    }
}