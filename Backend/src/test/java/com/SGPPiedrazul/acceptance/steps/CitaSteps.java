package com.SGPPiedrazul.acceptance.steps;

import com.SGPPiedrazul.acceptance.ScenarioContext;
import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.Paciente;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.GeneroPaciente;
import com.SGPPiedrazul.model.enums.TipoAtencion;
import com.SGPPiedrazul.model.enums.TipoProfesional;
import com.SGPPiedrazul.repository.FranjaHorariaRepository;
import com.SGPPiedrazul.repository.PacienteRepository;
import com.SGPPiedrazul.repository.ProfesionalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Y;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class CitaSteps {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext ctx;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    @Autowired private ProfesionalRepository profesionalRepository;
    @Autowired private FranjaHorariaRepository franjaHorariaRepository;
    @Autowired private PacienteRepository pacienteRepository;

    @Dado("que existe un profesional con franja de 08:00 a 10:00 e intervalo de 30 minutos")
    public void existeProfesionalConFranja() {
        Profesional prof = new Profesional();
        prof.setNombres("Dr. Acc Test " + System.nanoTime());
        prof.setTipo(TipoProfesional.MEDICO);
        prof.setEspecialidad(Especialidad.FISIOTERAPIA);
        prof.setIntervaloMinutos(30);
        Profesional saved = profesionalRepository.save(prof);
        ctx.profesionalId = saved.getId();

        DayOfWeek diaMañana = LocalDate.now().plusDays(1).getDayOfWeek();
        FranjaHoraria franja = new FranjaHoraria();
        franja.setDiaSemana(diaMañana);
        franja.setHoraInicio(LocalTime.of(8, 0));
        franja.setHoraFin(LocalTime.of(10, 0));
        franja.setProfesional(saved);
        franjaHorariaRepository.save(franja);
    }

    @Dado("existe un paciente de citas con documento {string}")
    public void existePacienteCitas(String documento) {
        Long id = pacienteRepository.findByDocumento(documento)
                .map(Paciente::getId)
                .orElseGet(() -> {
                    Paciente p = new Paciente();
                    p.setNombres("Acc Cita");
                    p.setApellidos("Paciente Test");
                    p.setDocumento(documento);
                    p.setTelefono("3002222222");
                    p.setGenero(GeneroPaciente.HOMBRE);
                    return pacienteRepository.save(p).getId();
                });
        ctx.pacienteId = id;
    }

    @Cuando("consulto los slots disponibles del profesional para mañana")
    public void consultarSlots() throws Exception {
        String mañana = LocalDate.now().plusDays(1).toString();
        ctx.lastResult = mockMvc.perform(get("/api/citas/slots")
                        .param("profesionalId", ctx.profesionalId.toString())
                        .param("fecha", mañana))
                .andReturn();
    }

    @Y("la respuesta contiene {int} slots disponibles")
    public void respuestaContieneSlots(int cantidad) throws Exception {
        String body = ctx.lastResult.getResponse().getContentAsString();
        int count = objectMapper.readTree(body).size();
        assertThat(count).as("número de slots").isEqualTo(cantidad);
    }

    @Cuando("agendo una cita para mañana a las {string}")
    public void agendarCita(String hora) throws Exception {
        ctx.lastResult = agendarCitaImpl(hora);
    }

    @Dado("ya existe una cita agendada para mañana a las {string}")
    public void yaExisteCitaAgendada(String hora) throws Exception {
        MvcResult res = agendarCitaImpl(hora);
        assertThat(res.getResponse().getStatus()).as("setup cita previa").isEqualTo(201);
    }

    @Dado("hay una cita programada para mañana a las {string}")
    public void hayCitaProgramada(String hora) throws Exception {
        MvcResult res = agendarCitaImpl(hora);
        assertThat(res.getResponse().getStatus()).as("setup cita a cancelar").isEqualTo(201);
        ctx.citaId = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();
    }

    @Cuando("cancelo la cita con motivo {string}")
    public void cancelarCita(String motivo) throws Exception {
        CitaDTO.CancelarRequest req = new CitaDTO.CancelarRequest();
        req.setMotivo(motivo);
        ctx.lastResult = mockMvc.perform(patch("/api/citas/" + ctx.citaId + "/cancelar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn();
    }

    @Y("la cita queda en estado {string}")
    public void citaEnEstado(String estado) throws Exception {
        String body = ctx.lastResult.getResponse().getContentAsString();
        String estadoReal = objectMapper.readTree(body).get("estado").asText();
        assertThat(estadoReal).isEqualTo(estado);
    }

    // ── helper ─────────────────────────────────────────────────────────────────

    private MvcResult agendarCitaImpl(String hora) throws Exception {
        String[] partes = hora.split(":");
        LocalDateTime slot = LocalDate.now().plusDays(1)
                .atTime(Integer.parseInt(partes[0]), Integer.parseInt(partes[1]));

        CitaDTO.AgendarRequest req = new CitaDTO.AgendarRequest();
        req.setProfesionalId(ctx.profesionalId);
        req.setPacienteId(ctx.pacienteId);
        req.setFechaHora(slot);
        req.setTipoAtencion(TipoAtencion.PRIMERA_VEZ);
        req.setMotivoConsulta("Prueba de aceptación");

        return mockMvc.perform(post("/api/citas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn();
    }
}
