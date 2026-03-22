package com.SGPPiedrazul.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
        private Integer totalCitas;

        public Response() {}

        public Response(Long id, String nombres, String apellidos,
                        String documento, String email, String telefono,
                        Integer totalCitas) {
            this.id = id;
            this.nombres = nombres;
            this.apellidos = apellidos;
            this.nombreCompleto = nombres + " " + apellidos;
            this.documento = documento;
            this.email = email;
            this.telefono = telefono;
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
        public Integer getTotalCitas() { return totalCitas; }
    }

   
}