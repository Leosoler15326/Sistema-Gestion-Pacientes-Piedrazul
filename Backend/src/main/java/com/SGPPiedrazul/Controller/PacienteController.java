package com.SGPPiedrazul.Controller;

import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    
    // Accesible por ADMINISTRADOR, AGENDADOR y MEDICO_TERAPISTA
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<PacienteDTO.Response>> listar() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    // ─── Buscar por nombre (para autocompletar en el frontend) ───
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<PacienteDTO.Response>> buscarPorNombre(
            @RequestParam String nombre) {
        return ResponseEntity.ok(pacienteService.buscarPorNombre(nombre));
    }

    // ─── Autocompletado por prefijo de documento (cédula) ───
    @GetMapping("/sugerencias-documento")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<PacienteDTO.Response>> sugerenciasPorDocumento(
            @RequestParam String prefijo) {
        return ResponseEntity.ok(pacienteService.sugerenciasPorDocumento(prefijo));
    }

    // ─── Buscar por documento ───
    @GetMapping("/documento/{documento}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<PacienteDTO.Response> buscarPorDocumento(
            @PathVariable String documento) {
        return ResponseEntity.ok(pacienteService.buscarPorDocumento(documento));
    }

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteDTO.Response> miPerfilPaciente() {
        return pacienteService.buscarPorUsuarioId(SecurityUtils.getIdUsuarioActual())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/mi-perfil")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteDTO.Response> completarPerfilPaciente(
            @Valid @RequestBody PacienteDTO.CompletarPerfilRequest dto) {
        PacienteDTO.Response r = pacienteService.completarPerfilUsuario(
                SecurityUtils.getIdUsuarioActual(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(r);
    }

    // ─── Buscar por ID (detalle completo) ───
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<PacienteDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    // ─── Crear paciente ───
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<PacienteDTO.Response> crear(
            @Valid @RequestBody PacienteDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pacienteService.crear(dto));
    }

    // ─── Actualizar paciente ───
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR')")
    public ResponseEntity<PacienteDTO.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteDTO.Request dto) {
        return ResponseEntity.ok(pacienteService.actualizar(id, dto));
    }
}