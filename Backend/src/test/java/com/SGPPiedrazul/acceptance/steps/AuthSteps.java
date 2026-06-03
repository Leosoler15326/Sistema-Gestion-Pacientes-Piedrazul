package com.SGPPiedrazul.acceptance.steps;

import com.SGPPiedrazul.acceptance.ScenarioContext;
import com.SGPPiedrazul.dto.AuthDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Y;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class AuthSteps {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext ctx;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Dado("que registro el usuario {string} con contraseña {string} y rol {string}")
    @Cuando("registro el usuario {string} con contraseña {string} y rol {string}")
    public void registrarUsuario(String username, String password, String rol) throws Exception {
        AuthDTO.RegistroRequest req = new AuthDTO.RegistroRequest();
        req.setNombreUsuario(username);
        req.setContrasena(password);
        req.setNombreCompleto("Acceptance Test " + username);
        req.setEmail(username + "@acc.test");
        req.setRol(rol);

        ctx.lastResult = mockMvc.perform(post("/api/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn();
    }

    @Cuando("registro de nuevo el usuario {string} con contraseña {string} y rol {string}")
    public void registrarDeNuevoUsuario(String username, String password, String rol) throws Exception {
        registrarUsuario(username, password, rol);
    }

    @Cuando("inicio sesión con usuario {string} y contraseña {string}")
    public void iniciarSesion(String username, String password) throws Exception {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest();
        req.setNombreUsuario(username);
        req.setContrasena(password);

        ctx.lastResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn();
    }

    @Y("la respuesta contiene un token de acceso")
    public void respuestaContieneToken() throws Exception {
        String body = ctx.lastResult.getResponse().getContentAsString();
        assertThat(body).contains("accessToken");
    }
}
