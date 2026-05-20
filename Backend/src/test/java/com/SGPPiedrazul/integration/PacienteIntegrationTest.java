package com.SGPPiedrazul.integration;

import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.model.enums.GeneroPaciente;
import com.SGPPiedrazul.repository.PacienteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para el módulo de Pacientes.
 * Verifica el flujo completo: PacienteController → PacienteService → PacienteRepository → H2.
 * No se usan mocks de servicios — se prueba la integración real entre capas.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser(username = "admin_it", roles = {"ADMINISTRADOR"})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("IT - Pacientes")
class PacienteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PacienteRepository pacienteRepository;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private static final String DOCUMENTO = "IT_PAC_DOC_001";

    @AfterAll
    void tearDown() {
        pacienteRepository.findByDocumento(DOCUMENTO).ifPresent(pacienteRepository::delete);
        pacienteRepository.findByDocumento("IT_PAC_DOC_002").ifPresent(pacienteRepository::delete);
    }

    @Test
    @Order(1)
    @DisplayName("IT-Pac-1: Crear paciente con datos válidos devuelve 201 y lo persiste en BD")
    void crearPaciente_datosValidos_retorna201() throws Exception {
        PacienteDTO.Request req = new PacienteDTO.Request();
        req.setNombres("María");
        req.setApellidos("González López");
        req.setDocumento(DOCUMENTO);
        req.setTelefono("3001234567");
        req.setGenero(GeneroPaciente.MUJER);
        req.setEmail("maria.it@piedrazul.test");

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documento").value(DOCUMENTO))
                .andExpect(jsonPath("$.nombres").value("María"))
                .andExpect(jsonPath("$.apellidos").value("González López"));
    }

    @Test
    @Order(2)
    @DisplayName("IT-Pac-2: Crear paciente con documento duplicado devuelve 400")
    void crearPaciente_documentoDuplicado_retorna400() throws Exception {
        PacienteDTO.Request req = new PacienteDTO.Request();
        req.setNombres("Otro");
        req.setApellidos("Paciente");
        req.setDocumento(DOCUMENTO);
        req.setTelefono("3009999999");
        req.setGenero(GeneroPaciente.HOMBRE);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(3)
    @DisplayName("IT-Pac-3: Listar todos los pacientes devuelve la lista con el paciente creado")
    void listarPacientes_conPacienteEnBD_retornaLista() throws Exception {
        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[?(@.documento == '" + DOCUMENTO + "')]").exists());
    }

    @Test
    @Order(4)
    @DisplayName("IT-Pac-4: Buscar paciente por nombre encuentra el paciente en BD")
    void buscarPorNombre_pacienteExistente_loEncuentra() throws Exception {
        mockMvc.perform(get("/api/pacientes/buscar")
                        .param("nombre", "María"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[?(@.documento == '" + DOCUMENTO + "')]").exists());
    }

    @Test
    @Order(5)
    @DisplayName("IT-Pac-5: Buscar paciente por documento devuelve datos correctos")
    void buscarPorDocumento_pacienteExistente_retornaDatos() throws Exception {
        mockMvc.perform(get("/api/pacientes/documento/" + DOCUMENTO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documento").value(DOCUMENTO))
                .andExpect(jsonPath("$.nombres").value("María"));
    }

    @Test
    @Order(6)
    @DisplayName("IT-Pac-6: Buscar paciente por documento inexistente devuelve 404")
    void buscarPorDocumento_noExiste_retorna404() throws Exception {
        mockMvc.perform(get("/api/pacientes/documento/DOC_INEXISTENTE_XYZ"))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(7)
    @DisplayName("IT-Pac-7: Crear paciente sin nombres devuelve 400 (validación Bean)")
    void crearPaciente_sinNombres_retorna400() throws Exception {
        PacienteDTO.Request req = new PacienteDTO.Request();
        req.setApellidos("Apellido");
        req.setDocumento("IT_PAC_DOC_002");
        req.setTelefono("3001111111");
        req.setGenero(GeneroPaciente.HOMBRE);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
