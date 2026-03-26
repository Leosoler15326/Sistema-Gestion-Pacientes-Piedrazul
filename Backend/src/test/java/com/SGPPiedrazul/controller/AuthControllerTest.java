package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.Controller.AuthController;
import com.SGPPiedrazul.dto.AuthDTO;
import com.SGPPiedrazul.service.AuthService;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.UserDetailsImpl;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

        @MockBean
        private UserDetailsServiceImpl userDetailsService;

        @MockBean
        private UserDetailsImpl userDetails;

    private AuthDTO.TokenResponse tokenResponse;

    @BeforeEach
    void setUp() {
        tokenResponse = new AuthDTO.TokenResponse(
                "access.token.jwt",
                "refresh.token.jwt",
                "admin",
                "Administrador del Sistema",
                "ADMINISTRADOR",
                1L
        );
    }

    // ─── POST /api/auth/login ───

    @Test
    @DisplayName("Login exitoso devuelve 200 con token")
    void login_credencialesValidas_retorna200() throws Exception {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setNombreUsuario("admin");
        request.setContrasena("Admin123!");

        when(authService.login(any())).thenReturn(tokenResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access.token.jwt"))
                .andExpect(jsonPath("$.nombreUsuario").value("admin"))
                .andExpect(jsonPath("$.rol").value("ADMINISTRADOR"));
    }

    @Test
    @DisplayName("Login con credenciales incorrectas devuelve 401")
    void login_credencialesInvalidas_retorna401() throws Exception {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setNombreUsuario("admin");
        request.setContrasena("wrongpass");

        when(authService.login(any())).thenThrow(new BadCredentialsException("Credenciales inválidas."));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // ─── POST /api/auth/registro ───

    @Test
    @DisplayName("Registro exitoso devuelve 200 con token")
    void registro_datosValidos_retorna200() throws Exception {
        AuthDTO.RegistroRequest request = new AuthDTO.RegistroRequest();
        request.setNombreUsuario("nuevo");
        request.setContrasena("Pass123!");
        request.setNombreCompleto("Nuevo Usuario");
        request.setEmail("nuevo@hospital.local");
        request.setRol("AGENDADOR");

        when(authService.registro(any())).thenReturn(tokenResponse);

        mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }

    @Test
    @DisplayName("Registro con usuario duplicado devuelve 400")
    void registro_usuarioDuplicado_retorna400() throws Exception {
        AuthDTO.RegistroRequest request = new AuthDTO.RegistroRequest();
        request.setNombreUsuario("admin");
        request.setContrasena("Admin123!");
        request.setNombreCompleto("Admin");
        request.setEmail("admin@hospital.local");
        request.setRol("ADMINISTRADOR");

        when(authService.registro(any()))
                .thenThrow(new IllegalArgumentException("El nombre de usuario ya está en uso."));

        mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ─── POST /api/auth/refresh ───

    @Test
    @DisplayName("Refresh token válido devuelve nuevo access token")
    void refresh_tokenValido_retornaNuevoToken() throws Exception {
        when(authService.refreshToken(anyString())).thenReturn(tokenResponse);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("refreshToken", "refresh.token.jwt"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access.token.jwt"));
    }

    @Test
    @DisplayName("Refresh token expirado devuelve 500")
    void refresh_tokenExpirado_retornaError() throws Exception {
        when(authService.refreshToken(anyString()))
                .thenThrow(new RuntimeException("Refresh token inválido o expirado."));

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("refreshToken", "expired.token"))))
                .andExpect(status().isInternalServerError());
    }

    // ─── GET /api/auth/verificar-email ───

    @Test
    @DisplayName("Token de verificación válido devuelve 200")
    void verificarEmail_tokenValido_retorna200() throws Exception {
        when(authService.verificarEmail("token-valido")).thenReturn(true);

        mockMvc.perform(get("/api/auth/verificar-email")
                        .param("token", "token-valido"))
                .andExpect(status().isOk())
                .andExpect(content().string("Email verificado correctamente."));
    }

    @Test
    @DisplayName("Token de verificación inválido devuelve 400")
    void verificarEmail_tokenInvalido_retorna400() throws Exception {
        when(authService.verificarEmail("token-invalido")).thenReturn(false);

        mockMvc.perform(get("/api/auth/verificar-email")
                        .param("token", "token-invalido"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Token inválido o expirado."));
    }
}