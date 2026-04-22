package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.Controller.HistoriaClinicaController;
import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.dto.HistoriaClinicaDTO;
import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.ProfesionalRepository;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.SecurityUtils;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import com.SGPPiedrazul.service.ICitaService;
import com.SGPPiedrazul.service.HistoriaClinicaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HistoriaClinicaController.class)
@AutoConfigureMockMvc(addFilters = false)
class HistoriaClinicaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HistoriaClinicaService historiaClinicaService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @MockitoBean
    private ProfesionalRepository profesionalRepository;

    @MockitoBean
    private ICitaService citaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private ObjectMapper objectMapper;
    private HistoriaClinicaDTO.Response historiaResponse;
    private HistoriaClinicaDTO.Request historiaRequest;
    private Usuario usuarioMock;
    private Profesional profesionalMock;
    private Cita citaMock;
    private CitaDTO.Response citaDTOResponseMock;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        historiaResponse = new HistoriaClinicaDTO.Response();
        historiaResponse.setId(1L);
        historiaResponse.setFechaAtencion(LocalDateTime.now());
        historiaResponse.setDescripcion("Paciente presenta dolor lumbar.");
        historiaResponse.setCitaId(1L);
        historiaResponse.setPacienteNombre("Juan Pérez García");
        historiaResponse.setPacienteDocumento("12345678");
        historiaResponse.setProfesionalNombre("Dr. García");
        historiaResponse.setEspecialidad("FISIOTERAPIA");

        historiaRequest = new HistoriaClinicaDTO.Request();
        historiaRequest.setCitaId(1L);
        historiaRequest.setDescripcion("Paciente presenta dolor lumbar.");

        usuarioMock = new Usuario();
        usuarioMock.setId(5L);
        usuarioMock.setNombreUsuario("dgarcia");

        profesionalMock = new Profesional();
        profesionalMock.setId(2L);
        profesionalMock.setNombres("Dr. García");

        citaMock = new Cita();
        citaMock.setId(1L);
        citaMock.setProfesional(profesionalMock);

        citaDTOResponseMock = new CitaDTO.Response();
        citaDTOResponseMock.setId(1L);
        citaDTOResponseMock.setProfesionalId(2L);
    }

    @Test
    @DisplayName("Registrar historia clínica válida devuelve 201")
    void registrar_datosValidos_retorna201() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("dgarcia");

            when(usuarioRepository.findByNombreUsuario("dgarcia"))
                    .thenReturn(Optional.of(usuarioMock));

            when(citaService.obtenerResumenPorId(1L)).thenReturn(citaDTOResponseMock);

            when(profesionalRepository.findById(2L))
                    .thenReturn(Optional.of(profesionalMock));

            when(historiaClinicaService.registrar(any(), any(), any()))
                    .thenReturn(historiaResponse);

            mockMvc.perform(post("/api/historias")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(historiaRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.pacienteNombre").value("Juan Pérez García"))
                    .andExpect(jsonPath("$.especialidad").value("FISIOTERAPIA"));
        }
    }

    @Test
    @DisplayName("Registrar historia sin profesional devuelve 404")
    void registrar_sinProfesional_retornaError() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("dgarcia");

            when(usuarioRepository.findByNombreUsuario("dgarcia"))
                    .thenReturn(Optional.of(usuarioMock));

            when(citaService.obtenerResumenPorId(1L)).thenReturn(citaDTOResponseMock);

            when(profesionalRepository.findById(2L))
                    .thenReturn(Optional.empty()); // 🔥 provoca error

            mockMvc.perform(post("/api/historias")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(historiaRequest)))
                    .andExpect(status().isNotFound());
        }
    }

    @Test
    @DisplayName("Registrar historia duplicada devuelve 409")
    void registrar_historiaDuplicada_retornaError() throws Exception {
        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("dgarcia");

            when(usuarioRepository.findByNombreUsuario("dgarcia"))
                    .thenReturn(Optional.of(usuarioMock));

            when(citaService.obtenerResumenPorId(1L)).thenReturn(citaDTOResponseMock);

            when(profesionalRepository.findById(2L))
                    .thenReturn(Optional.of(profesionalMock));

            when(historiaClinicaService.registrar(any(), any(), any()))
                    .thenThrow(new IllegalStateException(
                            "Ya existe una historia clínica para esta cita."));

            mockMvc.perform(post("/api/historias")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(historiaRequest)))
                    .andExpect(status().isConflict());
        }
    }

    @Test
    @DisplayName("Registrar historia sin descripción devuelve 400")
    void registrar_sinDescripcion_retorna400() throws Exception {
        historiaRequest.setDescripcion("");

        mockMvc.perform(post("/api/historias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(historiaRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Actualizar historia existente devuelve 200")
    void actualizar_existente_retorna200() throws Exception {
        HistoriaClinicaDTO.ActualizarRequest dto = new HistoriaClinicaDTO.ActualizarRequest();
        dto.setDescripcion("Descripción actualizada");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("dgarcia");

            when(usuarioRepository.findByNombreUsuario("dgarcia"))
                    .thenReturn(Optional.of(usuarioMock));

            when(historiaClinicaService.actualizar(eq(1L), any(), any()))
                    .thenReturn(historiaResponse);

            mockMvc.perform(put("/api/historias/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1));
        }
    }

    @Test
    @DisplayName("Actualizar historia inexistente devuelve 404")
    void actualizar_inexistente_retornaError() throws Exception {
        HistoriaClinicaDTO.ActualizarRequest dto = new HistoriaClinicaDTO.ActualizarRequest();
        dto.setDescripcion("Nueva descripción");

        try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
            su.when(SecurityUtils::getNombreUsuarioActual).thenReturn("dgarcia");

            when(usuarioRepository.findByNombreUsuario("dgarcia"))
                    .thenReturn(Optional.of(usuarioMock));

            when(historiaClinicaService.actualizar(eq(99L), any(), any()))
                    .thenThrow(new RuntimeException("Historia no encontrada con id: 99"));

            mockMvc.perform(put("/api/historias/99")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isNotFound());
        }
    }

    @Test
    @DisplayName("Buscar por cita devuelve 200")
    void buscarPorCita_existente_retorna200() throws Exception {
        when(historiaClinicaService.buscarPorCita(1L)).thenReturn(historiaResponse);

        mockMvc.perform(get("/api/historias/cita/1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Buscar por cita sin historia devuelve 500")
    void buscarPorCita_sinHistoria_retornaError() throws Exception {
        when(historiaClinicaService.buscarPorCita(99L))
                .thenThrow(new RuntimeException());

        mockMvc.perform(get("/api/historias/cita/99"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Listar por paciente")
    void listarPorPaciente_retorna200() throws Exception {
        when(historiaClinicaService.listarPorPaciente(1L))
                .thenReturn(List.of(historiaResponse));

        mockMvc.perform(get("/api/historias/paciente/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void listarPorPaciente_sinHistorias_retornaListaVacia() throws Exception {
        when(historiaClinicaService.listarPorPaciente(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/historias/paciente/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void listarPorProfesional_retorna200() throws Exception {
        when(historiaClinicaService.listarPorProfesional(2L))
                .thenReturn(List.of(historiaResponse));

        mockMvc.perform(get("/api/historias/profesional/2"))
                .andExpect(status().isOk());
    }

    @Test
    void listarPorProfesional_sinHistorias_retornaListaVacia() throws Exception {
        when(historiaClinicaService.listarPorProfesional(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/historias/profesional/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}