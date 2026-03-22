package com.SGPPiedrazul.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class HistoriaClinicaDTO {

    // ─── Request: Registrar historia ───
    public static class Request {

        @NotNull(message = "El id de la cita es obligatorio.")
        private Long citaId;

        @NotBlank(message = "La descripción es obligatoria.")
        private String descripcion;

        public Long getCitaId() { return citaId; }
        public void setCitaId(Long v) { this.citaId = v; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String v) { this.descripcion = v; }
    }

    // ─── Request: Actualizar historia ───
    public static class ActualizarRequest {

        @NotBlank(message = "La descripción es obligatoria.")
        private String descripcion;

        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String v) { this.descripcion = v; }
    }

    // ─── Response ───
    public static class Response {

        private Long id;
        private LocalDateTime fechaAtencion;
        private String descripcion;

        // Datos de la cita
        private Long citaId;
        private LocalDateTime fechaCita;

        // Datos del paciente
        private Long pacienteId;
        private String pacienteNombre;
        private String pacienteDocumento;

        // Datos del profesional
        private Long profesionalId;
        private String profesionalNombre;
        private String especialidad;

        public Response() {}

        // ─── Getters y Setters ───
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public LocalDateTime getFechaAtencion() { return fechaAtencion; }
        public void setFechaAtencion(LocalDateTime v) { this.fechaAtencion = v; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String v) { this.descripcion = v; }
        public Long getCitaId() { return citaId; }
        public void setCitaId(Long v) { this.citaId = v; }
        public LocalDateTime getFechaCita() { return fechaCita; }
        public void setFechaCita(LocalDateTime v) { this.fechaCita = v; }
        public Long getPacienteId() { return pacienteId; }
        public void setPacienteId(Long v) { this.pacienteId = v; }
        public String getPacienteNombre() { return pacienteNombre; }
        public void setPacienteNombre(String v) { this.pacienteNombre = v; }
        public String getPacienteDocumento() { return pacienteDocumento; }
        public void setPacienteDocumento(String v) { this.pacienteDocumento = v; }
        public Long getProfesionalId() { return profesionalId; }
        public void setProfesionalId(Long v) { this.profesionalId = v; }
        public String getProfesionalNombre() { return profesionalNombre; }
        public void setProfesionalNombre(String v) { this.profesionalNombre = v; }
        public String getEspecialidad() { return especialidad; }
        public void setEspecialidad(String v) { this.especialidad = v; }
    }
}