package com.SGPPiedrazul.Controller;

import com.SGPPiedrazul.dto.ConfiguracionAgendamientoDTO;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.service.ConfiguracionAgendamientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion/agendamiento")
public class ConfiguracionAgendamientoController {

    private final ConfiguracionAgendamientoService configuracionAgendamientoService;

    public ConfiguracionAgendamientoController(ConfiguracionAgendamientoService configuracionAgendamientoService) {
        this.configuracionAgendamientoService = configuracionAgendamientoService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConfiguracionAgendamientoDTO> obtener() {
        int semanas = configuracionAgendamientoService.getVentanaSemanasAgendar();
        return ResponseEntity.ok(new ConfiguracionAgendamientoDTO(semanas));
    }

    @PatchMapping("/ventana-semanas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ConfiguracionAgendamientoDTO> actualizarVentana(
            @RequestBody ConfiguracionAgendamientoDTO body) {
        String responsable = SecurityUtils.getNombreUsuarioActual();
        int v = configuracionAgendamientoService.actualizarVentanaSemanas(
                body.getVentanaSemanasAgendar(), responsable);
        return ResponseEntity.ok(new ConfiguracionAgendamientoDTO(v));
    }
}
