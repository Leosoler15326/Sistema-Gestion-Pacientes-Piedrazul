package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.model.HistoriaClinica;
import com.SGPPiedrazul.service.HistoriaClinicaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historias")
public class HistoriaClinicaController {

    private final HistoriaClinicaService historiaClinicaService;

    public HistoriaClinicaController(HistoriaClinicaService historiaClinicaService) {
        this.historiaClinicaService = historiaClinicaService;
    }

    @PostMapping
    public ResponseEntity<HistoriaClinica> registrar(@RequestBody Map<String, Object> body) {
        Long citaId = Long.valueOf(body.get("citaId").toString());
        String descripcion = body.get("descripcion").toString();

        // profesional y responsable vendrán del JWT en la siguiente fase
        HistoriaClinica historia = historiaClinicaService.registrar(citaId, descripcion, null, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(historia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinica> actualizar(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        String descripcion = body.get("descripcion");
        return ResponseEntity.ok(historiaClinicaService.actualizar(id, descripcion, null));
    }

    @GetMapping("/cita/{citaId}")
    public ResponseEntity<HistoriaClinica> buscarPorCita(@PathVariable Long citaId) {
        return ResponseEntity.ok(historiaClinicaService.buscarPorCita(citaId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistoriaClinica>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(historiaClinicaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<HistoriaClinica>> listarPorProfesional(@PathVariable Long profesionalId) {
        return ResponseEntity.ok(historiaClinicaService.listarPorProfesional(profesionalId));
    }
}
