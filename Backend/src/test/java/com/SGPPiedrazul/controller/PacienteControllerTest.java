package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.SGPPiedrazul.service.PacienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PacienteController.class)
@AutoConfigureMockMvc(addFilters = false)
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PacienteService pacienteService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private PacienteDTO.Response pacienteResponse;
    private PacienteDTO.Request pacienteRequest;

    @BeforeEach
    void setUp() {
        pacienteResponse = new PacienteDTO.Response(
                1L, "Juan", "Pérez García",
                "12345678", "juan@email.com", "3001234567", 2
        );


        pacienteRequest = new PacienteDTO.Request();
        pacienteRequest.setNombres("Juan");
        pacienteRequest.setApellidos("Pérez García");
        pacienteRequest.setDocumento("12345678");
        pacienteRequest.setEmail("juan@email.com");
        pacienteRequest.setTelefono("3001234567");
    }

    @Test
    @DisplayName("Listar pacientes devuelve 200 con lista resumida")
    void listar_retorna200ConListaResumida() throws Exception {
        when(pacienteService.listarTodos()).thenReturn(List.of(pacienteResponse));

        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].documento").value("12345678"));
    }

    @Test
    @DisplayName("Listar pacientes sin registros devuelve lista vacía")
    void listar_sinPacientes_retornaListaVacia() throws Exception {
        when(pacienteService.listarTodos()).thenReturn(List.of());

        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Buscar por nombre devuelve coincidencias")
    void buscarPorNombre_conCoincidencias_retornaLista() throws Exception {
        when(pacienteService.buscarPorNombre("juan"))
                .thenReturn(List.of(pacienteResponse));

        mockMvc.perform(get("/api/pacientes/buscar").param("nombre", "juan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombreCompleto").value("Juan Pérez García"));
    }

    @Test
    @DisplayName("Buscar por nombre sin coincidencias devuelve lista vacía")
    void buscarPorNombre_sinCoincidencias_retornaListaVacia() throws Exception {
        when(pacienteService.buscarPorNombre("xyz")).thenReturn(List.of());

        mockMvc.perform(get("/api/pacientes/buscar").param("nombre", "xyz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Buscar por documento existente devuelve 200")
    void buscarPorDocumento_existente_retorna200() throws Exception {
        when(pacienteService.buscarPorDocumento("12345678"))
                .thenReturn(pacienteResponse);

        mockMvc.perform(get("/api/pacientes/documento/12345678"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documento").value("12345678"))
                .andExpect(jsonPath("$.nombres").value("Juan"));
    }

    @Test
    @DisplayName("Buscar por documento inexistente devuelve 500")
    void buscarPorDocumento_inexistente_retornaError() throws Exception {
        when(pacienteService.buscarPorDocumento("99999999"))
                .thenThrow(new RuntimeException(
                        "Paciente no encontrado con documento: 99999999"));

        mockMvc.perform(get("/api/pacientes/documento/99999999"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Buscar por ID existente devuelve 200 con detalle completo")
    void buscarPorId_existente_retorna200() throws Exception {
        when(pacienteService.buscarPorId(1L)).thenReturn(pacienteResponse);

        mockMvc.perform(get("/api/pacientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombreCompleto").value("Juan Pérez García"))
                .andExpect(jsonPath("$.totalCitas").value(2));
    }

    @Test
    @DisplayName("Buscar por ID inexistente devuelve 500")
    void buscarPorId_inexistente_retornaError() throws Exception {
        when(pacienteService.buscarPorId(99L))
                .thenThrow(new RuntimeException("Paciente no encontrado con id: 99"));

        mockMvc.perform(get("/api/pacientes/99"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Crear paciente con datos válidos devuelve 201")
    void crear_datosValidos_retorna201() throws Exception {
        when(pacienteService.crear(any())).thenReturn(pacienteResponse);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documento").value("12345678"));
    }

    @Test
    @DisplayName("Crear paciente con documento duplicado devuelve 400")
    void crear_documentoDuplicado_retorna400() throws Exception {
        when(pacienteService.crear(any()))
                .thenThrow(new IllegalArgumentException(
                        "Ya existe un paciente con el documento: 12345678"));

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Crear paciente sin nombres devuelve 400 por validación")
    void crear_sinNombres_retorna400() throws Exception {
        pacienteRequest.setNombres("");

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Crear paciente sin documento devuelve 400 por validación")
    void crear_sinDocumento_retorna400() throws Exception {
        pacienteRequest.setDocumento(null);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Actualizar paciente existente devuelve 200")
    void actualizar_existente_retorna200() throws Exception {
        when(pacienteService.actualizar(eq(1L), any())).thenReturn(pacienteResponse);

        mockMvc.perform(put("/api/pacientes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("Actualizar paciente inexistente devuelve 500")
    void actualizar_inexistente_retornaError() throws Exception {
        when(pacienteService.actualizar(eq(99L), any()))
                .thenThrow(new RuntimeException("Paciente no encontrado con id: 99"));

        mockMvc.perform(put("/api/pacientes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pacienteRequest)))
                .andExpect(status().isInternalServerError());
    }
}
