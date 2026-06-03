package com.SGPPiedrazul.dto;

// ─── Request: Login ───
public class AuthDTO {

    public static class CambiarContrasenaRequest {
        private String contrasenaActual;
        private String nuevaContrasena;

        public String getContrasenaActual() { return contrasenaActual; }
        public void setContrasenaActual(String v) { this.contrasenaActual = v; }
        public String getNuevaContrasena() { return nuevaContrasena; }
        public void setNuevaContrasena(String v) { this.nuevaContrasena = v; }
    }

    public static class RecuperarContrasenaRequest {
        private String nombreUsuario;
        private String email;
        private String nuevaContrasena;

        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String v) { this.nombreUsuario = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getNuevaContrasena() { return nuevaContrasena; }
        public void setNuevaContrasena(String v) { this.nuevaContrasena = v; }
    }

    public static class LoginRequest {
        private String nombreUsuario;
        private String contrasena;

        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
        public String getContrasena() { return contrasena; }
        public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    }

    // ─── Request: Registro ───
    public static class RegistroRequest {
        private String nombreUsuario;
        private String contrasena;
        private String nombreCompleto;
        private String email;
        private String rol;

        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
        public String getContrasena() { return contrasena; }
        public void setContrasena(String contrasena) { this.contrasena = contrasena; }
        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
    }

    // ─── Response: Token JWT ───
    public static class TokenResponse {
        private String accessToken;
        private String refreshToken;
        private String nombreUsuario;
        private String nombreCompleto;
        private String rol;
        private Long id;

        public TokenResponse(String accessToken, String refreshToken,
                             String nombreUsuario, String nombreCompleto,
                             String rol, Long id) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.nombreUsuario = nombreUsuario;
            this.nombreCompleto = nombreCompleto;
            this.rol = rol;
            this.id = id;
        }

        public String getAccessToken() { return accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public String getNombreUsuario() { return nombreUsuario; }
        public String getNombreCompleto() { return nombreCompleto; }
        public String getRol() { return rol; }
        public Long getId() { return id; }
    }
}
