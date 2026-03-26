package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.Controller.ProfesionalController;
import com.SGPPiedrazul.dto.CrearProfesionalDTO;
import com.SGPPiedrazul.dto.ProfesionalResponseDTO;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.model.enums.RolUsuario;
import com.SGPPiedrazul.model.enums.TipoProfesional;
import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.SGPPiedrazul.service.ProfesionalService;
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

@WebMvcTest(ProfesionalController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProfesionalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfesionalService profesionalService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private ProfesionalResponseDTO profesionalResponse;
    private ProfesionalResponseDTO profesionalConUsuario;
    private CrearProfesionalDTO crearDTO;

    @BeforeEach
    void setUp() {
        profesionalResponse = crearDTOSinUsuario("Dr. García", "FISIOTERAPIA");
        profesionalConUsuario = crearDTOConUsuario("Dra. López", "QUIROPRAXIA", "dlopez");

        crearDTO = new CrearProfesionalDTO();
        crearDTO.setNombres("Dr. García");
        crearDTO.setTipo(TipoProfesional.MEDICO);
        crearDTO.setEspecialidad(Especialidad.FISIOTERAPIA);
        crearDTO.setIntervaloMinutos(30);
        crearDTO.setCrearUsuario(false);
    }

    private ProfesionalResponseDTO crearDTOSinUsuario(String nombres, String especialidad) {
        com.SGPPiedrazul.model.Profesional p = new com.SGPPiedrazul.model.Profesional();
        p.setNombres(nombres);
        p.setEspecialidad(Especialidad.valueOf(especialidad));
        p.setTipo(TipoProfesional.MEDICO);
        p.setIntervaloMinutos(30);
        p.setEstado(Estado.ACTIVO);
        return ProfesionalResponseDTO.sinUsuario(p);
    }

    private ProfesionalResponseDTO crearDTOConUsuario(String nombres, String especialidad,
                                                       String nombreUsuario) {
        com.SGPPiedrazul.model.Usuario u = new com.SGPPiedrazul.model.Usuario();
        u.setNombreUsuario(nombreUsuario);
        u.setRol(RolUsuario.MEDICO_TERAPISTA);

        com.SGPPiedrazul.model.Profesional p = new com.SGPPiedrazul.model.Profesional();
        p.setNombres(nombres);
        p.setEspecialidad(Especialidad.valueOf(especialidad));
        p.setTipo(TipoProfesional.MEDICO);
        p.setIntervaloMinutos(30);
        p.setEstado(Estado.ACTIVO);
        p.setUsuario(u);
        return ProfesionalResponseDTO.conUsuario(p);
    }

    @Test
    @DisplayName("Listar profesionales devuelve 200 con lista")
    void listar_retorna200ConLista() throws Exception {
        when(profesionalService.listarTodos())
                .thenReturn(List.of(profesionalResponse, profesionalConUsuario));

        mockMvc.perform(get("/api/profesionales"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("Listar activos devuelve solo profesionales activos")
    void listarActivos_retornaActivos() throws Exception {
        when(profesionalService.listarActivos()).thenReturn(List.of(profesionalResponse));

        mockMvc.perform(get("/api/profesionales/activos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("Listar por especialidad devuelve profesionales filtrados")
    void listarPorEspecialidad_retornaFiltrados() throws Exception {
        when(profesionalService.listarPorEspecialidad(Especialidad.FISIOTERAPIA))
                .thenReturn(List.of(profesionalResponse));

        mockMvc.perform(get("/api/profesionales/especialidad/FISIOTERAPIA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("Buscar por ID existente devuelve 200")
    void buscarPorId_existente_retorna200() throws Exception {
        when(profesionalService.buscarPorIdDTO(1L)).thenReturn(profesionalResponse);

        mockMvc.perform(get("/api/profesionales/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombres").value("Dr. García"))
                .andExpect(jsonPath("$.usuarioVinculado").value(false));
    }

    @Test
    @DisplayName("Buscar por ID inexistente devuelve 500")
    void buscarPorId_inexistente_retornaError() throws Exception {
        when(profesionalService.buscarPorIdDTO(99L))
                .thenThrow(new RuntimeException("Profesional no encontrado con id: 99"));

        mockMvc.perform(get("/api/profesionales/99"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Mi perfil devuelve el profesional del usuario autenticado")
    void miPerfil_autenticado_retorna200() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getIdUsuarioActual).thenReturn(5L);
            when(profesionalService.buscarPorUsuarioId(5L))
                    .thenReturn(profesionalConUsuario);

            mockMvc.perform(get("/api/profesionales/mi-perfil"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.usuarioVinculado").value(true))
                    .andExpect(jsonPath("$.nombreUsuario").value("dlopez"));
        }
    }

    @Test
    @DisplayName("Mi perfil sin profesional vinculado devuelve 500")
    void miPerfil_sinVinculo_retornaError() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getIdUsuarioActual).thenReturn(99L);
            when(profesionalService.buscarPorUsuarioId(99L))
                    .thenThrow(new RuntimeException(
                            "No hay profesional vinculado al usuario con id: 99"));

            mockMvc.perform(get("/api/profesionales/mi-perfil"))
                    .andExpect(status().isInternalServerError());
        }
    }

    @Test
    @DisplayName("Buscar por usuarioId existente devuelve el profesional vinculado")
    void buscarPorUsuarioId_existente_retorna200() throws Exception {
        when(profesionalService.buscarPorUsuarioId(5L))
                .thenReturn(profesionalConUsuario);

        mockMvc.perform(get("/api/profesionales/usuario/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioVinculado").value(true));
    }

    @Test
    @DisplayName("Crear profesional sin usuario devuelve 201")
    void crear_sinUsuario_retorna201() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(profesionalService.crear(any(), anyString()))
                    .thenReturn(profesionalResponse);

            mockMvc.perform(post("/api/profesionales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(crearDTO)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.nombres").value("Dr. García"))
                    .andExpect(jsonPath("$.usuarioVinculado").value(false));
        }
    }

    @Test
    @DisplayName("Crear profesional con usuario devuelve 201 con usuarioVinculado true")
    void crear_conUsuario_retorna201ConVinculo() throws Exception {
        crearDTO.setCrearUsuario(true);
        crearDTO.setNombreUsuario("dgarcia");
        crearDTO.setContrasena("Pass123!");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(profesionalService.crear(any(), anyString()))
                    .thenReturn(profesionalConUsuario);

            mockMvc.perform(post("/api/profesionales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(crearDTO)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.usuarioVinculado").value(true));
        }
    }

    @Test
    @DisplayName("Crear profesional con usuario duplicado devuelve 400")
    void crear_usuarioDuplicado_retorna400() throws Exception {
        crearDTO.setCrearUsuario(true);
        crearDTO.setNombreUsuario("dgarcia");
        crearDTO.setContrasena("Pass123!");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(profesionalService.crear(any(), anyString()))
                    .thenThrow(new IllegalArgumentException(
                            "El nombre de usuario 'dgarcia' ya está en uso."));

            mockMvc.perform(post("/api/profesionales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(crearDTO)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    @DisplayName("Actualizar profesional existente devuelve 200")
    void actualizar_existente_retorna200() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(profesionalService.actualizar(eq(1L), any(), anyString()))
                    .thenReturn(profesionalResponse);

            mockMvc.perform(put("/api/profesionales/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(crearDTO)))
                    .andExpect(status().isOk());
        }
    }

    @Test
    @DisplayName("Cambiar estado a INACTIVO devuelve 204")
    void cambiarEstado_aInactivo_retorna204() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            doNothing().when(profesionalService)
                    .cambiarEstado(eq(1L), eq(Estado.INACTIVO), anyString());

            mockMvc.perform(patch("/api/profesionales/1/estado")
                            .param("estado", "INACTIVO"))
                    .andExpect(status().isNoContent());
        }
    }

    @Test
    @DisplayName("Listar franjas de profesional devuelve 200")
    void listarFranjas_retorna200() throws Exception {
        when(profesionalService.listarFranjas(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/profesionales/1/franjas"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Actualizar franjas devuelve 204")
    void actualizarFranjas_retorna204() throws Exception {
        doNothing().when(profesionalService).actualizarFranjas(eq(1L), any());

        mockMvc.perform(put("/api/profesionales/1/franjas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of())))
                .andExpect(status().isNoContent());
    }
}
