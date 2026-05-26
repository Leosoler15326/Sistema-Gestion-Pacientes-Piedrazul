package com.SGPPiedrazul.Controller;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.ICitaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final ICitaService citaService;
    private final UsuarioRepository usuarioRepository;

    public CitaController(ICitaService citaService,
                          UsuarioRepository usuarioRepository) {
        this.citaService = citaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/slots")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA','PACIENTE')")
    public ResponseEntity<List<CitaDTO.SlotResponse>> obtenerSlots(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.obtenerSlots(profesionalId, fecha));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA','PACIENTE')")
    public ResponseEntity<CitaDTO.Response> agendar(
            @Valid @RequestBody CitaDTO.AgendarRequest dto) {
        Usuario creadoPor = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaService.agendar(dto, creadoPor));
    }

    @PostMapping("/agendar-contacto")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR')")
    public ResponseEntity<CitaDTO.Response> agendarDesdeContacto(
            @Valid @RequestBody CitaDTO.AgendarContactoRequest dto) {
        Usuario creadoPor = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaService.agendarDesdeContacto(dto, creadoPor));
    }

    @PutMapping("/{id}/reagendar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<CitaDTO.Response> reagendar(
            @PathVariable Long id,
            @Valid @RequestBody CitaDTO.ReagendarRequest dto) {
        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.ok(citaService.reagendar(id, dto, responsable));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @RequestBody CitaDTO.CancelarRequest dto) {
        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        citaService.cancelar(id, dto, responsable);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<CitaDTO.Response> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CitaDTO.CambiarEstadoRequest dto) {
        Usuario responsable = usuarioRepository
                .findByNombreUsuario(SecurityUtils.getNombreUsuarioActual())
                .orElse(null);
        return ResponseEntity.ok(citaService.cambiarEstado(id, dto, responsable));
    }

    @GetMapping("/profesional")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<List<CitaDTO.Response>> listarPorProfesional(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        LocalDate fin = fechaFin != null ? fechaFin : fechaInicio;
        return ResponseEntity.ok(
                citaService.listarPorProfesionalYRangoFechas(profesionalId, fechaInicio, fin)
        );
    }

    @GetMapping(value = "/exportar-csv", produces = "text/csv;charset=UTF-8")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<byte[]> exportarCsv(
            @RequestParam Long profesionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        byte[] data = citaService.exportarCsvProfesionalFecha(profesionalId, fecha);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"citas_" + profesionalId + "_" + fecha + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(data);
    }

    @GetMapping(value = "/exportar-csv-todos", produces = "text/csv;charset=UTF-8")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA')")
    public ResponseEntity<byte[]> exportarCsvTodos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        byte[] data = citaService.exportarCsvTodosFecha(fecha);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"citas_todos_" + fecha + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(data);
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA','PACIENTE')")
    public ResponseEntity<List<CitaDTO.Response>> listarPorPaciente(
            @PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarPorPaciente(pacienteId));
    }

    /** Ruta bajo /consulta para no colisionar con GET /{id}. */
    @GetMapping("/consulta/mis-citas")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<CitaDTO.Response>> misCitas() {
        return ResponseEntity.ok(citaService.listarMisCitasComoPaciente());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','AGENDADOR','MEDICO_TERAPISTA','PACIENTE')")
    public ResponseEntity<CitaDTO.Response> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.buscarPorId(id));
    }
}
