package com.SGPPiedrazul.dto;

import com.SGPPiedrazul.model.enums.GeneroPaciente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class PacienteDTO {

    // ─── Request: Crear / Actualizar ───
    public static class Request {

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres.")
        private String nombres;

        @NotBlank(message = "Los apellidos son obligatorios.")
        @Size(max = 100, message = "Los apellidos no pueden superar 100 caracteres.")
        private String apellidos;

        @NotBlank(message = "El documento es obligatorio.")
        @Size(max = 20, message = "El documento no puede superar 20 caracteres.")
        private String documento;

        @Size(max = 100, message = "El email no puede superar 100 caracteres.")
        private String email;

        @Size(max = 20, message = "El teléfono no puede superar 20 caracteres.")
        private String telefono;

        private GeneroPaciente genero;

        private LocalDate fechaNacimiento;

        // ─── Getters y Setters ───
        public String getNombres() { return nombres; }
        public void setNombres(String nombres) { this.nombres = nombres; }

        public String getApellidos() { return apellidos; }
        public void setApellidos(String apellidos) { this.apellidos = apellidos; }

        public String getDocumento() { return documento; }
        public void setDocumento(String documento) { this.documento = documento; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }

        public GeneroPaciente getGenero() { return genero; }
        public void setGenero(GeneroPaciente genero) { this.genero = genero; }

        public LocalDate getFechaNacimiento() { return fechaNacimiento; }
        public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    }

    /** Registro de ficha clínica mínima para usuario con rol PACIENTE. */
    public static class CompletarPerfilRequest {

        @NotBlank(message = "El documento es obligatorio.")
        @Size(max = 20)
        private String documento;

        @NotBlank(message = "Los nombres son obligatorios.")
        @Size(max = 100)
        private String nombres;

        @NotBlank(message = "Los apellidos son obligatorios.")
        @Size(max = 100)
        private String apellidos;

        @NotBlank(message = "El celular es obligatorio.")
        @Size(max = 20)
        private String telefono;

        @NotNull(message = "El género es obligatorio.")
        private GeneroPaciente genero;

        private LocalDate fechaNacimiento;

        @Size(max = 100)
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

    // ─── Response ───
    public static class Response {

        private Long id;
        private String nombres;
        private String apellidos;
        private String nombreCompleto;
        private String documento;
        private String email;
        private String telefono;
        private String genero;
        private LocalDate fechaNacimiento;
        private Integer totalCitas;

        public Response() {}

        public Response(Long id, String nombres, String apellidos,
                        String documento, String email, String telefono,
                        String genero, LocalDate fechaNacimiento,
                        Integer totalCitas) {
            this.id = id;
            this.nombres = nombres;
            this.apellidos = apellidos;
            this.nombreCompleto = nombres + " " + apellidos;
            this.documento = documento;
            this.email = email;
            this.telefono = telefono;
            this.genero = genero;
            this.fechaNacimiento = fechaNacimiento;
            this.totalCitas = totalCitas;
        }

        // ─── Getters ───
        public Long getId() { return id; }
        public String getNombres() { return nombres; }
        public String getApellidos() { return apellidos; }
        public String getNombreCompleto() { return nombreCompleto; }
        public String getDocumento() { return documento; }
        public String getEmail() { return email; }
        public String getTelefono() { return telefono; }
        public String getGenero() { return genero; }
        public LocalDate getFechaNacimiento() { return fechaNacimiento; }
        public Integer getTotalCitas() { return totalCitas; }
    }

   
}