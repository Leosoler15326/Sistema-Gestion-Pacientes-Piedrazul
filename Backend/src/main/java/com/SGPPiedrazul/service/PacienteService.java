package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.model.Paciente;
import com.SGPPiedrazul.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    // ─── Crear ───
    @Transactional
    public PacienteDTO.Response crear(PacienteDTO.Request dto) {
        if (pacienteRepository.existsByDocumento(dto.getDocumento())) {
            throw new IllegalArgumentException(
                    "Ya existe un paciente con el documento: " + dto.getDocumento());
        }

        Paciente paciente = new Paciente();
        paciente.setNombres(dto.getNombres());
        paciente.setApellidos(dto.getApellidos());
        paciente.setDocumento(dto.getDocumento());
        paciente.setEmail(dto.getEmail());
        paciente.setTelefono(dto.getTelefono());

        Paciente guardado = pacienteRepository.save(paciente);
        return toResponse(guardado);
    }

    // ─── Actualizar ───
    @Transactional
    public PacienteDTO.Response actualizar(Long id, PacienteDTO.Request dto) {
        Paciente paciente = buscarEntidadPorId(id);

        // Verifica que el documento no esté en uso por otro paciente
        pacienteRepository.findByDocumento(dto.getDocumento()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new IllegalArgumentException(
                        "El documento ya está registrado en otro paciente.");
            }
        });

        paciente.setNombres(dto.getNombres());
        paciente.setApellidos(dto.getApellidos());
        paciente.setDocumento(dto.getDocumento());
        paciente.setEmail(dto.getEmail());
        paciente.setTelefono(dto.getTelefono());

        return toResponse(pacienteRepository.save(paciente));
    }

    // ─── Consultas ───
    @Transactional(readOnly = true)
    public PacienteDTO.Response buscarPorId(Long id) {
        return toResponse(buscarEntidadPorId(id));
    }

    @Transactional(readOnly = true)
    public PacienteDTO.Response buscarPorDocumento(String documento) {
        Paciente paciente = pacienteRepository.findByDocumento(documento)
                .orElseThrow(() -> new RuntimeException(
                        "Paciente no encontrado con documento: " + documento));
        return toResponse(paciente);
    }

    @Transactional(readOnly = true)
    public List<PacienteDTO.Response> listarTodos() {
        List<PacienteDTO.Response> dtos = new ArrayList<>();
        for (Paciente p : pacienteRepository.findAll()) {
            dtos.add(toResponse(p));
        }
        return dtos;
    }

    @Transactional(readOnly = true)
    public List<PacienteDTO.Response> buscarPorNombre(String nombre) {
        List<PacienteDTO.Response> dtos = new ArrayList<>();

        for (Paciente p : pacienteRepository.findAll()) {
            String nombreCompleto = p.getNombres().toLowerCase() + " " + p.getApellidos().toLowerCase();
            if (nombreCompleto.contains(nombre.toLowerCase())) {
                dtos.add(toResponse(p));
            }
        }
        return dtos;
    }

    // ─── Acceso interno (para otros servicios) ───
    public Paciente buscarEntidadPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Paciente no encontrado con id: " + id));
    }

    // ─── Mapeo a DTOs ───
    private PacienteDTO.Response toResponse(Paciente p) {
        return new PacienteDTO.Response(
                p.getId(),
                p.getNombres(),
                p.getApellidos(),
                p.getDocumento(),
                p.getEmail(),
                p.getTelefono(),
                p.getCitas() != null ? p.getCitas().size() : 0
        );
    }
}