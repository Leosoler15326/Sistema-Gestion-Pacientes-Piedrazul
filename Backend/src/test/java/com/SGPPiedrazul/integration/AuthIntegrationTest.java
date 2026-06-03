package com.SGPPiedrazul.integration;

import com.SGPPiedrazul.dto.AuthDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para el flujo completo de autenticación.
 * Usa el contexto Spring completo + H2 en memoria (sin mocks de servicios).
 * Cubre: registro → login → token JWT real generado por JwtService.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("IT - Autenticación")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String USERNAME = "it_auth_user";
    private static final String PASSWORD = "TestPass123!";
    private static final String EMAIL    = "it_auth@piedrazul.test";

    @Test
    @Order(1)
    @DisplayName("IT-Auth-1: Registro de nuevo usuario devuelve 200 con token JWT")
    void registro_usuarioNuevo_retornaTokenJwt() throws Exception {
        AuthDTO.RegistroRequest req = new AuthDTO.RegistroRequest();
        req.setNombreUsuario(USERNAME);
        req.setContrasena(PASSWORD);
        req.setNombreCompleto("Usuario Integration Test");
        req.setEmail(EMAIL);
        req.setRol("AGENDADOR");

        mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.nombreUsuario").value(USERNAME))
                .andExpect(jsonPath("$.rol").value("AGENDADOR"));
    }

    @Test
    @Order(2)
    @DisplayName("IT-Auth-2: Registro con nombre de usuario duplicado devuelve 400")
    void registro_usuarioDuplicado_retorna400() throws Exception {
        AuthDTO.RegistroRequest req = new AuthDTO.RegistroRequest();
        req.setNombreUsuario(USERNAME);
        req.setContrasena(PASSWORD);
        req.setNombreCompleto("Duplicado");
        req.setEmail("otro_it@piedrazul.test");
        req.setRol("AGENDADOR");

        mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(3)
    @DisplayName("IT-Auth-3: Login con credenciales válidas devuelve 200 con tokens")
    void login_credencialesCorrectas_retornaTokens() throws Exception {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest();
        req.setNombreUsuario(USERNAME);
        req.setContrasena(PASSWORD);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.nombreUsuario").value(USERNAME))
                .andExpect(jsonPath("$.rol").value("AGENDADOR"));
    }

    @Test
    @Order(4)
    @DisplayName("IT-Auth-4: Login con contraseña incorrecta devuelve 401")
    void login_contrasenaIncorrecta_retorna401() throws Exception {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest();
        req.setNombreUsuario(USERNAME);
        req.setContrasena("claveErronea99!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    @DisplayName("IT-Auth-5: Login con usuario inexistente devuelve 401")
    void login_usuarioNoExiste_retorna401() throws Exception {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest();
        req.setNombreUsuario("no_existe_xyz_9999");
        req.setContrasena("cualquiera");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }
}
