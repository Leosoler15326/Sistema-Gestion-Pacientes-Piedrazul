package com.SGPPiedrazul.controller;
 
import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.CitaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/citas")
public class CitaController {
 
    private final CitaService citaService;
    private final UsuarioRepository usuarioRepository;
 
    public CitaController(CitaService citaService, UsuarioRepository usuarioRepository) {
        this.citaService = citaService;
        this.usuarioRepository = usuarioRepository;
    }
 
    @GetMapping("/slots")
    public ResponseEntity<List<LocalDateTime>> obtenerSlots(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.obtenerSlotsDisponibles(profesionalId, fecha));
    }
 
    @PostMapping
    public ResponseEntity<Cita> agendar(@RequestBody Map<String, Object> body) {
        Long profesionalId = Long.valueOf(body.get("profesionalId").toString());
        Long pacienteId = Long.valueOf(body.get("pacienteId").toString());
        LocalDateTime fechaHora = LocalDateTime.parse(body.get("fechaHora").toString());
        String tipoAtencion = body.get("tipoAtencion").toString();
        String motivoConsulta = body.getOrDefault("motivoConsulta", "").toString();
 
        // Extrae el usuario autenticado desde el JWT
        Usuario creadoPor = usuarioRepository.findByNombreUsuario(
                SecurityUtils.getNombreUsuarioActual()).orElse(null);
 
        Cita cita = citaService.agendar(profesionalId, pacienteId, fechaHora,
                tipoAtencion, motivoConsulta, creadoPor);
 
        return ResponseEntity.status(HttpStatus.CREATED).body(cita);
    }
 
    @PutMapping("/{id}/reagendar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<Cita> reagendar(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        LocalDateTime nuevaFecha = LocalDateTime.parse(body.get("nuevaFechaHora"));
        String motivo = body.getOrDefault("motivo", "");
 
        Usuario responsable = usuarioRepository.findByNombreUsuario(
                SecurityUtils.getNombreUsuarioActual()).orElse(null);
 
        return ResponseEntity.ok(citaService.reagendar(id, nuevaFecha, motivo, responsable));
    }
 
    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<Void> cancelar(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        String motivo = body.getOrDefault("motivo", "");
        Usuario responsable = usuarioRepository.findByNombreUsuario(
                SecurityUtils.getNombreUsuarioActual()).orElse(null);
 
        citaService.cancelar(id, motivo, responsable);
        return ResponseEntity.noContent().build();
    }
 
    @GetMapping("/profesional")
    public ResponseEntity<List<Cita>> listarPorProfesional(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.listarPorProfesionalYFecha(profesionalId, fecha));
    }
 
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Cita>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarPorPaciente(pacienteId));
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<Cita> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.buscarPorId(id));
    }
}