package com.SGPPiedrazul.dto;

import com.SGPPiedrazul.model.enums.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UsuarioDTO {

    // ─── Request: Crear usuario ───
    public static class Request {

        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(max = 50, message = "El nombre de usuario no puede superar 50 caracteres.")
        private String nombreUsuario;

        @NotBlank(message = "La contraseña es obligatoria.")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
        private String contrasena;

        @NotBlank(message = "El nombre completo es obligatorio.")
        @Size(max = 100)
        private String nombreCompleto;

        @NotBlank(message = "El email es obligatorio.")
        @Email(message = "El email no tiene un formato válido.")
        private String email;

        @NotNull(message = "El rol es obligatorio.")
        private RolUsuario rol;

        // ─── Getters y Setters ───
        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String v) { this.nombreUsuario = v; }
        public String getContrasena() { return contrasena; }
        public void setContrasena(String v) { this.contrasena = v; }
        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String v) { this.nombreCompleto = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public RolUsuario getRol() { return rol; }
        public void setRol(RolUsuario v) { this.rol = v; }
    }

    // ─── Request: Actualizar usuario (sin contraseña) ───
    public static class ActualizarRequest {

        @NotBlank(message = "El nombre completo es obligatorio.")
        @Size(max = 100)
        private String nombreCompleto;

        @NotBlank(message = "El email es obligatorio.")
        @Email(message = "El email no tiene un formato válido.")
        private String email;

        @NotNull(message = "El rol es obligatorio.")
        private RolUsuario rol;

        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String v) { this.nombreCompleto = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public RolUsuario getRol() { return rol; }
        public void setRol(RolUsuario v) { this.rol = v; }
    }

    // ─── Response ───
    public static class Response {

        private Long id;
        private String nombreUsuario;
        private String nombreCompleto;
        private String email;
        private String rol;
        private String estado;
        private Boolean emailVerificado;

        public Response() {}

        public Response(Long id, String nombreUsuario, String nombreCompleto,
                        String email, String rol, String estado, Boolean emailVerificado) {
            this.id = id;
            this.nombreUsuario = nombreUsuario;
            this.nombreCompleto = nombreCompleto;
            this.email = email;
            this.rol = rol;
            this.estado = estado;
            this.emailVerificado = emailVerificado;
        }

        public Long getId() { return id; }
        public String getNombreUsuario() { return nombreUsuario; }
        public String getNombreCompleto() { return nombreCompleto; }
        public String getEmail() { return email; }
        public String getRol() { return rol; }
        public String getEstado() { return estado; }
        public Boolean getEmailVerificado() { return emailVerificado; }
    }
}