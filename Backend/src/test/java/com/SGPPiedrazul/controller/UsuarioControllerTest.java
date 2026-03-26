package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.Controller.UsuarioController;
import com.SGPPiedrazul.dto.UsuarioDTO;
import com.SGPPiedrazul.model.enums.RolUsuario;
import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.SGPPiedrazul.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private UsuarioDTO.Response usuarioResponse;
    private UsuarioDTO.Request usuarioRequest;
    private UsuarioDTO.ActualizarRequest actualizarRequest;

    @BeforeEach
    void setUp() {
        usuarioResponse = new UsuarioDTO.Response(
                1L, "admin", "Administrador del Sistema",
                "admin@hospital.local", "ADMINISTRADOR", "ACTIVO", true
        );

        usuarioRequest = new UsuarioDTO.Request();
        usuarioRequest.setNombreUsuario("nuevo");
        usuarioRequest.setContrasena("Pass123!");
        usuarioRequest.setNombreCompleto("Nuevo Usuario");
        usuarioRequest.setEmail("nuevo@hospital.local");
        usuarioRequest.setRol(RolUsuario.AGENDADOR);

        actualizarRequest = new UsuarioDTO.ActualizarRequest();
        actualizarRequest.setNombreCompleto("Admin Actualizado");
        actualizarRequest.setEmail("admin2@hospital.local");
        actualizarRequest.setRol(RolUsuario.ADMINISTRADOR);
    }

    @Test
    @DisplayName("Listar todos los usuarios devuelve 200 con lista")
    void listar_retorna200ConLista() throws Exception {
        when(usuarioService.listarTodos()).thenReturn(List.of(usuarioResponse));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombreUsuario").value("admin"));
    }

    @Test
    @DisplayName("Listar cuando no hay usuarios devuelve lista vacía")
    void listar_sinUsuarios_retornaListaVacia() throws Exception {
        when(usuarioService.listarTodos()).thenReturn(List.of());

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Listar activos devuelve solo usuarios activos")
    void listarActivos_retornaUsuariosActivos() throws Exception {
        when(usuarioService.listarActivos()).thenReturn(List.of(usuarioResponse));

        mockMvc.perform(get("/api/usuarios/activos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].estado").value("ACTIVO"));
    }

    @Test
    @DisplayName("Buscar usuario por ID existente devuelve 200")
    void buscarPorId_idExistente_retorna200() throws Exception {
        when(usuarioService.buscarPorId(1L)).thenReturn(usuarioResponse);

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombreUsuario").value("admin"))
                .andExpect(jsonPath("$.rol").value("ADMINISTRADOR"));
    }

    @Test
    @DisplayName("Buscar usuario por ID inexistente devuelve 500")
    void buscarPorId_idInexistente_retornaError() throws Exception {
        when(usuarioService.buscarPorId(99L))
                .thenThrow(new RuntimeException("Usuario no encontrado con id: 99"));

        mockMvc.perform(get("/api/usuarios/99"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Crear usuario con datos válidos devuelve 201")
    void crear_datosValidos_retorna201() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioService.crear(any(), anyString())).thenReturn(usuarioResponse);

            mockMvc.perform(post("/api/usuarios")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(usuarioRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.nombreUsuario").value("admin"));
        }
    }

    @Test
    @DisplayName("Crear usuario con nombre duplicado devuelve 400")
    void crear_nombreDuplicado_retorna400() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioService.crear(any(), anyString()))
                    .thenThrow(new IllegalArgumentException(
                            "El nombre de usuario ya está en uso."));

            mockMvc.perform(post("/api/usuarios")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(usuarioRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    @DisplayName("Crear usuario sin nombre devuelve 400 por validación")
    void crear_sinNombreUsuario_retorna400() throws Exception {
        usuarioRequest.setNombreUsuario("");

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Actualizar usuario existente devuelve 200")
    void actualizar_datosValidos_retorna200() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioService.actualizar(eq(1L), any(), anyString()))
                    .thenReturn(usuarioResponse);

            mockMvc.perform(put("/api/usuarios/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(actualizarRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1));
        }
    }

    @Test
    @DisplayName("Desactivar usuario existente devuelve 204")
    void desactivar_usuarioExistente_retorna204() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            doNothing().when(usuarioService).desactivar(eq(1L), anyString());

            mockMvc.perform(patch("/api/usuarios/1/desactivar"))
                    .andExpect(status().isNoContent());
        }
    }

    @Test
    @DisplayName("Desactivar usuario inexistente devuelve 500")
    void desactivar_usuarioInexistente_retornaError() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            doThrow(new RuntimeException("Usuario no encontrado con id: 99"))
                    .when(usuarioService).desactivar(eq(99L), anyString());

            mockMvc.perform(patch("/api/usuarios/99/desactivar"))
                    .andExpect(status().isInternalServerError());
        }
    }
}
