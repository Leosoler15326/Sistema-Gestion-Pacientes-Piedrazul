package com.SGPPiedrazul.service.export;

import com.SGPPiedrazul.dto.CitaDTO;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class CsvSemicolonUtf8CitaListExporter implements CitaListExporter {

    @Override
    public byte[] export(List<CitaDTO.Response> citas) {
        StringBuilder sb = new StringBuilder("\uFEFF");
        sb.append("id;fechaHora;pacienteDocumento;pacienteNombre;profesional;especialidad;estado;tipoAtencion\n");
        for (CitaDTO.Response r : citas) {
            sb.append(r.getId()).append(';')
                    .append(r.getFechaHora() != null ? r.getFechaHora().toString() : "").append(';')
                    .append(csvCampo(r.getPacienteDocumento())).append(';')
                    .append(csvCampo(r.getPacienteNombre())).append(';')
                    .append(csvCampo(r.getProfesionalNombre())).append(';')
                    .append(csvCampo(r.getEspecialidad())).append(';')
                    .append(csvCampo(r.getEstado())).append(';')
                    .append(csvCampo(r.getTipoAtencion())).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String csvCampo(String s) {
        if (s == null) {
            return "";
        }
        String t = s.replace("\"", "\"\"");
        return "\"" + t + "\"";
    }
}
