package com.SGPPiedrazul.dto;

import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.model.enums.GeneroPaciente;
import com.SGPPiedrazul.model.enums.TipoAtencion;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CitaDTO {

    // ─── Request: Agendar cita ───
    public static class AgendarRequest {

        @NotNull(message = "El profesional es obligatorio.")
        private Long profesionalId;

        @NotNull(message = "El paciente es obligatorio.")
        private Long pacienteId;

        @NotNull(message = "La fecha y hora son obligatorias.")
        @Future(message = "La fecha debe ser futura.")
        private LocalDateTime fechaHora;

        @NotNull(message = "El tipo de atención es obligatorio.")
        private TipoAtencion tipoAtencion;

        private String motivoConsulta;

        public Long getProfesionalId() { return profesionalId; }
        public void setProfesionalId(Long v) { this.profesionalId = v; }
        public Long getPacienteId() { return pacienteId; }
        public void setPacienteId(Long v) { this.pacienteId = v; }
        public LocalDateTime getFechaHora() { return fechaHora; }
        public void setFechaHora(LocalDateTime v) { this.fechaHora = v; }
        public TipoAtencion getTipoAtencion() { return tipoAtencion; }
        public void setTipoAtencion(TipoAtencion v) { this.tipoAtencion = v; }
        public String getMotivoConsulta() { return motivoConsulta; }
        public void setMotivoConsulta(String v) { this.motivoConsulta = v; }
    }

    /** Datos mínimos del paciente para contacto (WhatsApp / recepción). */
    public static class PacienteContactoDTO {

        @NotBlank(message = "El documento es obligatorio.")
        private String documento;

        @NotBlank(message = "Los nombres son obligatorios.")
        private String nombres;

        @NotBlank(message = "Los apellidos son obligatorios.")
        private String apellidos;

        @NotBlank(message = "El celular es obligatorio.")
        private String telefono;

        @NotNull(message = "El género es obligatorio.")
        private GeneroPaciente genero;

        private LocalDate fechaNacimiento;

        private String email;

        public String getDocumento() { return documento; }
        public void setDocumento(String documento) { this.documento = documento; }
        public String getNombres() { return nombres; }
        public void setNombres(String nombres) { this.nombres = nombres; }
        public String getApellidos() { return apellidos; }
        public void setApellidos(String apellidos) { this.apellidos = apellidos; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
        public GeneroPaciente getGenero() { return genero; }
        public void setGenero(GeneroPaciente genero) { this.genero = genero; }
        public LocalDate getFechaNacimiento() { return fechaNacimiento; }
        public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    /** Agendar cita creando o actualizando paciente por documento (flujo agendador). */
    public static class AgendarContactoRequest {

        @NotNull(message = "Los datos del paciente son obligatorios.")
        @Valid
        private PacienteContactoDTO paciente;

        @NotNull(message = "El profesional es obligatorio.")
        private Long profesionalId;

        @NotNull(message = "La fecha y hora son obligatorias.")
        @Future(message = "La fecha debe ser futura.")
        private LocalDateTime fechaHora;

        @NotNull(message = "El tipo de atención es obligatorio.")
        private TipoAtencion tipoAtencion;

        private String motivoConsulta;

        public PacienteContactoDTO getPaciente() { return paciente; }
        public void setPaciente(PacienteContactoDTO paciente) { this.paciente = paciente; }
        public Long getProfesionalId() { return profesionalId; }
        public void setProfesionalId(Long profesionalId) { this.profesionalId = profesionalId; }
        public LocalDateTime getFechaHora() { return fechaHora; }
        public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
        public TipoAtencion getTipoAtencion() { return tipoAtencion; }
        public void setTipoAtencion(TipoAtencion tipoAtencion) { this.tipoAtencion = tipoAtencion; }
        public String getMotivoConsulta() { return motivoConsulta; }
        public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }
    }

    // ─── Request: Reagendar cita ───
    public static class ReagendarRequest {

        @NotNull(message = "La nueva fecha y hora son obligatorias.")
        @Future(message = "La nueva fecha debe ser futura.")
        private LocalDateTime nuevaFechaHora;

        private String motivo;

        private Long nuevoProfesionalId;

        public LocalDateTime getNuevaFechaHora() { return nuevaFechaHora; }
        public void setNuevaFechaHora(LocalDateTime v) { this.nuevaFechaHora = v; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String v) { this.motivo = v; }
        public Long getNuevoProfesionalId() { return nuevoProfesionalId; }
        public void setNuevoProfesionalId(Long v) { this.nuevoProfesionalId = v; }
    }

    // ─── Request: Cancelar cita ───
    public static class CancelarRequest {
        private String motivo;

        public String getMotivo() { return motivo; }
        public void setMotivo(String v) { this.motivo = v; }
    }

    // ─── Request: Cambiar estado de cita ───
    public static class CambiarEstadoRequest {

        @NotNull(message = "El estado es obligatorio.")
        private EstadoCita estado;

        private String observacion;

        public EstadoCita getEstado() { return estado; }
        public void setEstado(EstadoCita e) { this.estado = e; }
        public String getObservacion() { return observacion; }
        public void setObservacion(String o) { this.observacion = o; }
    }

    // ─── Response ───
    public static class Response {

        private Long id;
        private LocalDateTime fechaHora;
        private String estado;
        private String tipoAtencion;
        private String motivoConsulta;

        // Datos resumidos del paciente
        private Long pacienteId;
        private String pacienteNombre;
        private String pacienteDocumento;

        // Datos resumidos del profesional
        private Long profesionalId;
        private String profesionalNombre;
        private String especialidad;

        // Quién creó la cita
        private String creadoPor;

        public Response() {}

        // ─── Getters y Setters ───
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public LocalDateTime getFechaHora() { return fechaHora; }
        public void setFechaHora(LocalDateTime v) { this.fechaHora = v; }
        public String getEstado() { return estado; }
        public void setEstado(String v) { this.estado = v; }
        public String getTipoAtencion() { return tipoAtencion; }
        public void setTipoAtencion(String v) { this.tipoAtencion = v; }
        public String getMotivoConsulta() { return motivoConsulta; }
        public void setMotivoConsulta(String v) { this.motivoConsulta = v; }
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
        public String getCreadoPor() { return creadoPor; }
        public void setCreadoPor(String v) { this.creadoPor = v; }
    }

    // ─── Response: Slots disponibles ───
    public static class SlotResponse {
        private LocalDateTime fechaHora;
        private String horaFormateada;

        public SlotResponse(LocalDateTime fechaHora) {
            this.fechaHora = fechaHora;
            this.horaFormateada = fechaHora.toLocalTime()
                    .toString().substring(0, 5);
        }

        public LocalDateTime getFechaHora() { return fechaHora; }
        public String getHoraFormateada() { return horaFormateada; }
    }
}