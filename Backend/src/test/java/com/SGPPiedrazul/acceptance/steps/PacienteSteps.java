package com.SGPPiedrazul.acceptance.steps;

import com.SGPPiedrazul.acceptance.ScenarioContext;
import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.model.Paciente;
import com.SGPPiedrazul.model.enums.GeneroPaciente;
import com.SGPPiedrazul.repository.PacienteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class PacienteSteps {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext ctx;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    @Autowired private PacienteRepository pacienteRepository;

    // Precondición: inserta el paciente directamente en BD para que el test de la acción sea limpio
    @Dado("que existe un paciente con documento {string}")
    public void existePacienteConDocumento(String documento) {
        if (pacienteRepository.findByDocumento(documento).isEmpty()) {
            Paciente p = new Paciente();
            p.setNombres("Acc");
            p.setApellidos("Paciente Setup");
            p.setDocumento(documento);
            p.setTelefono("3001111111");
            p.setGenero(GeneroPaciente.HOMBRE);
            pacienteRepository.save(p);
        }
    }

    @Cuando("registro el paciente con documento {string} nombres {string} apellidos {string} teléfono {string}")
    public void registrarPaciente(String documento, String nombres, String apellidos, String telefono) throws Exception {
        PacienteDTO.Request req = new PacienteDTO.Request();
        req.setDocumento(documento);
        req.setNombres(nombres);
        req.setApellidos(apellidos);
        req.setTelefono(telefono);
        req.setGenero(GeneroPaciente.MUJER);

        ctx.lastResult = mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn();
    }

    @Cuando("busco el paciente por documento {string}")
    public void buscarPacientePorDocumento(String documento) throws Exception {
        ctx.lastResult = mockMvc.perform(get("/api/pacientes/documento/" + documento))
                .andReturn();
    }
}
