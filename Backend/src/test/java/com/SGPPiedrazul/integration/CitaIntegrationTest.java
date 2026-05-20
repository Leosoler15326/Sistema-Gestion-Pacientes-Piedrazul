package com.SGPPiedrazul.integration;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.*;
import com.SGPPiedrazul.model.enums.*;
import com.SGPPiedrazul.repository.*;
import com.SGPPiedrazul.security.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para el módulo de Citas.
 * Verifica el flujo: CitaController → CitaService → DisponibilidadService → repositorios → H2.
 *
 * Usa UserDetailsImpl real en el SecurityContext (en lugar de @WithMockUser) para que
 * SecurityUtils.getUsuarioActual() no lance ClassCastException al hacer cast al principal.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("IT - Citas")
class CitaIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ProfesionalRepository profesionalRepository;
    @Autowired private FranjaHorariaRepository franjaHorariaRepository;
    @Autowired private PacienteRepository pacienteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private CitaRepository citaRepository;
    @Autowired private ConfiguracionAgendamientoRepository configuracionRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private static final String ADMIN_USERNAME = "admin_cita_it";
    private static final String DOC_PACIENTE   = "IT_CITA_DOC_001";

    private Long profesionalId;
    private Long pacienteId;
    private Usuario testUsuario;

    // ─── Setup / Teardown ────────────────────────────────────────────────────

    @BeforeAll
    void setUp() {
        // Singleton de configuración requerido por CitaService.validarDiaDentroDeVentana
        if (!configuracionRepository.existsById(ConfiguracionAgendamiento.SINGLETON_ID)) {
            ConfiguracionAgendamiento config = new ConfiguracionAgendamiento();
            configuracionRepository.save(config);
        }

        // Usuario admin en H2 (SecurityUtils buscará su nombre de usuario)
        testUsuario = usuarioRepository.findByNombreUsuario(ADMIN_USERNAME)
                .orElseGet(() -> {
                    Usuario u = new Usuario();
                    u.setNombreUsuario(ADMIN_USERNAME);
                    u.setContrasena(passwordEncoder.encode("TestPass123!"));
                    u.setNombreCompleto("Admin IT Citas");
                    u.setEmail("admin_cita_it@piedrazul.test");
                    u.setRol(RolUsuario.ADMINISTRADOR);
                    u.setEmailVerificado(true);
                    return usuarioRepository.save(u);
                });

        // Profesional con intervalo de 30 min
        Profesional prof = new Profesional();
        prof.setNombres("Dr. Integración Citas");
        prof.setTipo(TipoProfesional.MEDICO);
        prof.setEspecialidad(Especialidad.FISIOTERAPIA);
        prof.setIntervaloMinutos(30);
        Profesional savedProf = profesionalRepository.save(prof);
        profesionalId = savedProf.getId();

        // Franja horaria para mañana: 08:00–10:00 → genera 4 slots de 30 min
        DayOfWeek diaMañana = LocalDate.now().plusDays(1).getDayOfWeek();
        FranjaHoraria franja = new FranjaHoraria();
        franja.setDiaSemana(diaMañana);
        franja.setHoraInicio(LocalTime.of(8, 0));
        franja.setHoraFin(LocalTime.of(10, 0));
        franja.setProfesional(savedProf);
        franjaHorariaRepository.save(franja);

        // Paciente de prueba
        pacienteId = pacienteRepository.findByDocumento(DOC_PACIENTE)
                .map(Paciente::getId)
                .orElseGet(() -> {
                    Paciente p = new Paciente();
                    p.setNombres("Paciente IT");
                    p.setApellidos("Citas Test");
                    p.setDocumento(DOC_PACIENTE);
                    p.setTelefono("3002222222");
                    p.setGenero(GeneroPaciente.HOMBRE);
                    return pacienteRepository.save(p).getId();
                });
    }

    @BeforeEach
    void configurarSecurityContext() {
        // Construir un UserDetailsImpl REAL con el usuario guardado en H2.
        // Esto es necesario porque SecurityUtils hace cast (UserDetailsImpl) auth.getPrincipal()
        // y @WithMockUser inyecta un User genérico que lanza ClassCastException.
        UserDetailsImpl userDetails = new UserDetailsImpl(testUsuario);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void limpiarSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Transactional
    @AfterAll
    @org.springframework.transaction.annotation.Transactional
    void tearDown() {
        citaRepository.findByPacienteId(pacienteId).forEach(citaRepository::delete);
        pacienteRepository.findByDocumento(DOC_PACIENTE).ifPresent(pacienteRepository::delete);
        if (profesionalId != null) {
            franjaHorariaRepository.deleteByProfesionalId(profesionalId);
            profesionalRepository.deleteById(profesionalId);
        }
        usuarioRepository.findByNombreUsuario(ADMIN_USERNAME).ifPresent(usuarioRepository::delete);
    }

    // ─── Tests ───────────────────────────────────────────────────────────────

    @Test
    @Order(1)
    @DisplayName("IT-Cita-1: Profesional con franja activa devuelve 4 slots disponibles")
    void obtenerSlots_profesionalConFranja_retornaSlotsCalculados() throws Exception {
        String mañana = LocalDate.now().plusDays(1).toString();

        mockMvc.perform(get("/api/citas/slots")
                        .param("profesionalId", profesionalId.toString())
                        .param("fecha", mañana))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(4)); // 08:00, 08:30, 09:00, 09:30
    }

    @Test
    @Order(2)
    @DisplayName("IT-Cita-2: Profesional sin franja en ese día devuelve lista vacía")
    void obtenerSlots_sinFranjaEnEseDia_retornaVacio() throws Exception {
        // Buscar un día distinto al de mañana (que no tiene franja configurada)
        DayOfWeek diaMañana = LocalDate.now().plusDays(1).getDayOfWeek();
        LocalDate fechaSinFranja = LocalDate.now().plusDays(2);
        while (fechaSinFranja.getDayOfWeek() == diaMañana) {
            fechaSinFranja = fechaSinFranja.plusDays(1);
        }

        mockMvc.perform(get("/api/citas/slots")
                        .param("profesionalId", profesionalId.toString())
                        .param("fecha", fechaSinFranja.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @Order(3)
    @DisplayName("IT-Cita-3: Agendar cita en slot disponible devuelve 201 y persiste la cita")
    void agendarCita_slotDisponible_retorna201() throws Exception {
        LocalDateTime slot = LocalDate.now().plusDays(1).atTime(8, 0);

        CitaDTO.AgendarRequest req = new CitaDTO.AgendarRequest();
        req.setProfesionalId(profesionalId);
        req.setPacienteId(pacienteId);
        req.setFechaHora(slot);
        req.setTipoAtencion(TipoAtencion.PRIMERA_VEZ);
        req.setMotivoConsulta("Dolor de espalda – prueba integración");

        mockMvc.perform(post("/api/citas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("PROGRAMADA"))
                .andExpect(jsonPath("$.tipoAtencion").value("PRIMERA_VEZ"))
                .andExpect(jsonPath("$.profesionalNombre").value("Dr. Integración Citas"));
    }

    @Test
    @Order(4)
    @DisplayName("IT-Cita-4: Agendar cita en slot ya ocupado devuelve 409 (conflicto)")
    void agendarCita_slotOcupado_retorna409() throws Exception {
        // El slot 08:00 de mañana fue ocupado por el test anterior
        LocalDateTime slotOcupado = LocalDate.now().plusDays(1).atTime(8, 0);

        CitaDTO.AgendarRequest req = new CitaDTO.AgendarRequest();
        req.setProfesionalId(profesionalId);
        req.setPacienteId(pacienteId);
        req.setFechaHora(slotOcupado);
        req.setTipoAtencion(TipoAtencion.PRIMERA_VEZ);
        req.setMotivoConsulta("Intento de duplicar cita");

        mockMvc.perform(post("/api/citas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    @Order(5)
    @DisplayName("IT-Cita-5: Listar citas del paciente muestra la cita agendada")
    void listarCitasPorPaciente_conCitaAgendada_retornaLista() throws Exception {
        mockMvc.perform(get("/api/citas/paciente/" + pacienteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].estado").value("PROGRAMADA"));
    }
}
