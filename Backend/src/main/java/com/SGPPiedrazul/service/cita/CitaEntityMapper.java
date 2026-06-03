package com.SGPPiedrazul.service.cita;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.Cita;
import org.springframework.stereotype.Component;

/**
 * SRP: única responsabilidad de mapear entidad {@link Cita} a DTO de respuesta.
 */
@Component
public class CitaEntityMapper {

    public CitaDTO.Response toResponse(Cita c) {
        CitaDTO.Response dto = new CitaDTO.Response();
        dto.setId(c.getId());
        dto.setFechaHora(c.getFechaHora());
        dto.setEstado(c.getEstado().name());
        dto.setTipoAtencion(c.getTipoAtencion().name());
        dto.setMotivoConsulta(c.getMotivoConsulta());

        if (c.getPaciente() != null) {
            dto.setPacienteId(c.getPaciente().getId());
            dto.setPacienteNombre(c.getPaciente().getNombres()
                    + " " + c.getPaciente().getApellidos());
            dto.setPacienteDocumento(c.getPaciente().getDocumento());
        }

        if (c.getProfesional() != null) {
            dto.setProfesionalId(c.getProfesional().getId());
            dto.setProfesionalNombre(c.getProfesional().getNombres());
            dto.setEspecialidad(c.getProfesional().getEspecialidad().name());
        }

        if (c.getCreadoPor() != null) {
            dto.setCreadoPor(c.getCreadoPor().getNombreUsuario());
        }

        return dto;
    }
}
