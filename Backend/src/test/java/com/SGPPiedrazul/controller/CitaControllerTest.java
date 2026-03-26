package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.TipoAtencion;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.SGPPiedrazul.service.CitaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CitaController.class)
@AutoConfigureMockMvc(addFilters = false)
class CitaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CitaService citaService;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private ObjectMapper objectMapper;
    private CitaDTO.Response citaResponse;
    private CitaDTO.AgendarRequest agendarRequest;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        citaResponse = new CitaDTO.Response();
        citaResponse.setId(1L);
        citaResponse.setFechaHora(LocalDateTime.now().plusDays(1));
        citaResponse.setEstado("PROGRAMADA");
        citaResponse.setTipoAtencion("PRIMERA_VEZ");
        citaResponse.setPacienteNombre("Juan Pérez García");
        citaResponse.setProfesionalNombre("Dr. García");
        citaResponse.setEspecialidad("FISIOTERAPIA");
        citaResponse.setCreadoPor("admin");

        agendarRequest = new CitaDTO.AgendarRequest();
        agendarRequest.setProfesionalId(1L);
        agendarRequest.setPacienteId(1L);
        agendarRequest.setFechaHora(LocalDateTime.now().plusDays(1));
        agendarRequest.setTipoAtencion(TipoAtencion.PRIMERA_VEZ);
        agendarRequest.setMotivoConsulta("Dolor de espalda");
    }

    @Test
    @DisplayName("Obtener slots disponibles devuelve 200 con lista")
    void obtenerSlots_retorna200() throws Exception {
        CitaDTO.SlotResponse slot = new CitaDTO.SlotResponse(
                LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
        when(citaService.obtenerSlots(eq(1L), any(LocalDate.class)))
                .thenReturn(List.of(slot));

        mockMvc.perform(get("/api/citas/slots")
                        .param("profesionalId", "1")
                        .param("fecha", LocalDate.now().plusDays(1).toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].horaFormateada").exists());
    }
    /*
    @Test
    @DisplayName("Obtener slots sin disponibilidad devuelve lista vacía")
    void obtenerSlots_sinDisponibilidad_retornaListaVacia() throws Exception {
        when(citaService.obtenerSlots(eq(1L), any(LocalDate.class)))
                .thenReturn(List.of(CitaDTO.SlotResponse).isEmpty());

        mockMvc.perform(get("/api/citas/slots")
                        .param("profesionalId", "1")
                        .param("fecha", LocalDate.now().plusDays(1).toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
        */
    @Test
    @DisplayName("Agendar cita con datos válidos devuelve 201")
    void agendar_datosValidos_retorna201() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioRepository.findByNombreUsuario("admin"))
                    .thenReturn(Optional.of(new Usuario()));
            when(citaService.agendar(any(), any())).thenReturn(citaResponse);

            mockMvc.perform(post("/api/citas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(agendarRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.estado").value("PROGRAMADA"))
                    .andExpect(jsonPath("$.pacienteNombre").value("Juan Pérez García"));
        }
    }

    @Test
    @DisplayName("Agendar cita en horario ocupado devuelve 500")
    void agendar_horarioOcupado_retornaError() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioRepository.findByNombreUsuario("admin"))
                    .thenReturn(Optional.of(new Usuario()));
            when(citaService.agendar(any(), any()))
                    .thenThrow(new IllegalStateException(
                            "El horario seleccionado ya no está disponible."));

            mockMvc.perform(post("/api/citas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(agendarRequest)))
                    .andExpect(status().isInternalServerError());
        }
    }

    @Test
    @DisplayName("Reagendar cita existente devuelve 200")
    void reagendar_citaExistente_retorna200() throws Exception {
        CitaDTO.ReagendarRequest dto = new CitaDTO.ReagendarRequest();
        dto.setNuevaFechaHora(LocalDateTime.now().plusDays(2));
        dto.setMotivo("Conflicto de horario");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioRepository.findByNombreUsuario("admin"))
                    .thenReturn(Optional.of(new Usuario()));
            when(citaService.reagendar(eq(1L), any(), any()))
                    .thenReturn(citaResponse);

            mockMvc.perform(put("/api/citas/1/reagendar")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1));
        }
    }

    @Test
    @DisplayName("Reagendar cita en horario no disponible devuelve 500")
    void reagendar_horarioNoDisponible_retornaError() throws Exception {
        CitaDTO.ReagendarRequest dto = new CitaDTO.ReagendarRequest();
        dto.setNuevaFechaHora(LocalDateTime.now().plusDays(2));

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioRepository.findByNombreUsuario("admin"))
                    .thenReturn(Optional.of(new Usuario()));
            when(citaService.reagendar(eq(1L), any(), any()))
                    .thenThrow(new IllegalStateException(
                            "El nuevo horario no está disponible."));

            mockMvc.perform(put("/api/citas/1/reagendar")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isInternalServerError());
        }
    }

    @Test
    @DisplayName("Cancelar cita existente devuelve 204")
    void cancelar_citaExistente_retorna204() throws Exception {
        CitaDTO.CancelarRequest dto = new CitaDTO.CancelarRequest();
        dto.setMotivo("Paciente no puede asistir");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("admin");
            when(usuarioRepository.findByNombreUsuario("admin"))
                    .thenReturn(Optional.of(new Usuario()));
            doNothing().when(citaService).cancelar(eq(1L), any(), any());

            mockMvc.perform(patch("/api/citas/1/cancelar")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isNoContent());
        }
    }

    @Test
    @DisplayName("Listar citas por profesional y fecha devuelve 200")
    void listarPorProfesional_retorna200() throws Exception {
        when(citaService.listarPorProfesionalYRangoFechas(eq(1L), any(LocalDate.class),any(LocalDate.class)))
                .thenReturn(List.of(citaResponse));

        mockMvc.perform(get("/api/citas/profesional")
                        .param("profesionalId", "1")
                        .param("fecha", LocalDate.now().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].profesionalNombre").value("Dr. García"));
    }

    @Test
    @DisplayName("Listar citas por paciente devuelve 200")
    void listarPorPaciente_retorna200() throws Exception {
        when(citaService.listarPorPaciente(1L)).thenReturn(List.of(citaResponse));

        mockMvc.perform(get("/api/citas/paciente/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].pacienteNombre").value("Juan Pérez García"));
    }

    @Test
    @DisplayName("Listar citas de paciente sin citas devuelve lista vacía")
    void listarPorPaciente_sinCitas_retornaListaVacia() throws Exception {
        when(citaService.listarPorPaciente(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/citas/paciente/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("Buscar cita por ID existente devuelve 200")
    void buscarPorId_existente_retorna200() throws Exception {
        when(citaService.buscarPorId(1L)).thenReturn(citaResponse);

        mockMvc.perform(get("/api/citas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.estado").value("PROGRAMADA"));
    }

    @Test
    @DisplayName("Buscar cita por ID inexistente devuelve 500")
    void buscarPorId_inexistente_retornaError() throws Exception {
        when(citaService.buscarPorId(99L))
                .thenThrow(new RuntimeException("Cita no encontrada con id: 99"));

        mockMvc.perform(get("/api/citas/99"))
                .andExpect(status().isInternalServerError());
    }
}
