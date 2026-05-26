package com.SGPPiedrazul.service.export;

import com.SGPPiedrazul.dto.CitaDTO;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class PorMedicoCsvExporter {

    public byte[] export(List<CitaDTO.Response> citas) {
        // Agrupa las citas por nombre del profesional, preservando orden de atención
        LinkedHashMap<String, List<String>> porMedico = new LinkedHashMap<>();
        for (CitaDTO.Response c : citas) {
            String medico = c.getProfesionalNombre() != null ? c.getProfesionalNombre() : "Sin médico";
            String paciente = c.getPacienteNombre() != null ? c.getPacienteNombre() : "";
            porMedico.computeIfAbsent(medico, k -> new ArrayList<>()).add(paciente);
        }

        if (porMedico.isEmpty()) {
            return "﻿Sin citas para la fecha seleccionada\n".getBytes(StandardCharsets.UTF_8);
        }

        List<String> medicos = new ArrayList<>(porMedico.keySet());
        int maxFilas = porMedico.values().stream().mapToInt(List::size).max().orElse(0);

        StringBuilder sb = new StringBuilder("﻿");

        // Encabezado: nombres de los médicos separados por ;
        sb.append(medicos.stream()
                .map(this::csvCampo)
                .collect(Collectors.joining(";")));
        sb.append("\n");

        // Filas: pacientes en orden de atención, columna por médico
        for (int i = 0; i < maxFilas; i++) {
            for (int j = 0; j < medicos.size(); j++) {
                List<String> pacientes = porMedico.get(medicos.get(j));
                String nombre = i < pacientes.size() ? pacientes.get(i) : "";
                sb.append(csvCampo(nombre));
                if (j < medicos.size() - 1) sb.append(';');
            }
            sb.append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvCampo(String s) {
        if (s == null || s.isEmpty()) return "";
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
