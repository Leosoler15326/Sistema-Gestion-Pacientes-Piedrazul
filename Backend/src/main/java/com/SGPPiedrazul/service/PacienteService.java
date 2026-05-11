package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.PacienteDTO;
import com.SGPPiedrazul.model.Paciente;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.repository.PacienteRepository;
import com.SGPPiedrazul.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PacienteService(PacienteRepository pacienteRepository,
                           UsuarioRepository usuarioRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PacienteDTO.Response crear(PacienteDTO.Request dto) {
        if (pacienteRepository.existsByDocumento(dto.getDocumento())) {
            throw new IllegalArgumentException(
                    "Ya existe un paciente con el documento: " + dto.getDocumento());
        }

        Paciente paciente = new Paciente();
        copiarRequest(dto, paciente);
        Paciente guardado = pacienteRepository.save(paciente);
        return toResponse(guardado);
    }

    @Transactional
    public PacienteDTO.Response actualizar(Long id, PacienteDTO.Request dto) {
        Paciente paciente = buscarEntidadPorId(id);

        pacienteRepository.findByDocumento(dto.getDocumento()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new IllegalArgumentException(
                        "El documento ya está registrado en otro paciente.");
            }
        });

        copiarRequest(dto, paciente);
        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public PacienteDTO.Response completarPerfilUsuario(Long usuarioId,
                                                       PacienteDTO.CompletarPerfilRequest dto) {
        if (pacienteRepository.findByUsuarioId(usuarioId).isPresent()) {
            throw new IllegalStateException("Ya completó su perfil de paciente.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        String doc = dto.getDocumento().trim();

        Optional<Paciente> porDoc = pacienteRepository.findByDocumento(doc);
        if (porDoc.isPresent()) {
            Paciente p = porDoc.get();
            if (p.getUsuario() != null && !p.getUsuario().getId().equals(usuarioId)) {
                throw new IllegalArgumentException(
                        "Este documento ya está vinculado a otro usuario.");
            }
            p.setUsuario(usuario);
            p.setNombres(dto.getNombres().trim());
            p.setApellidos(dto.getApellidos().trim());
            p.setTelefono(dto.getTelefono().trim());
            p.setGenero(dto.getGenero());
            p.setFechaNacimiento(dto.getFechaNacimiento());
            if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
                p.setEmail(dto.getEmail().trim());
            }
            return toResponse(pacienteRepository.save(p));
        }

        Paciente p = new Paciente();
        p.setUsuario(usuario);
        p.setDocumento(doc);
        p.setNombres(dto.getNombres().trim());
        p.setApellidos(dto.getApellidos().trim());
        p.setTelefono(dto.getTelefono().trim());
        p.setGenero(dto.getGenero());
        p.setFechaNacimiento(dto.getFechaNacimiento());
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            p.setEmail(dto.getEmail().trim());
        }
        return toResponse(pacienteRepository.save(p));
    }

    @Transactional(readOnly = true)
    public List<PacienteDTO.Response> sugerenciasPorDocumento(String prefijo) {
        if (prefijo == null || prefijo.trim().length() < 2) {
            return List.of();
        }
        return pacienteRepository
                .findTop15ByDocumentoStartingWithIgnoreCaseOrderByDocumentoAsc(prefijo.trim())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

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

    @Transactional(readOnly = true)
    public Optional<PacienteDTO.Response> buscarPorUsuarioId(Long usuarioId) {
        return pacienteRepository.findByUsuarioId(usuarioId).map(this::toResponse);
    }

    public Paciente buscarEntidadPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Paciente no encontrado con id: " + id));
    }

    private void copiarRequest(PacienteDTO.Request dto, Paciente paciente) {
        paciente.setNombres(dto.getNombres());
        paciente.setApellidos(dto.getApellidos());
        paciente.setDocumento(dto.getDocumento());
        paciente.setEmail(dto.getEmail());
        paciente.setTelefono(dto.getTelefono());
        paciente.setGenero(dto.getGenero());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
    }

    private PacienteDTO.Response toResponse(Paciente p) {
        String generoStr = p.getGenero() != null ? p.getGenero().name() : null;
        return new PacienteDTO.Response(
                p.getId(),
                p.getNombres(),
                p.getApellidos(),
                p.getDocumento(),
                p.getEmail(),
                p.getTelefono(),
                generoStr,
                p.getFechaNacimiento(),
                p.getCitas() != null ? p.getCitas().size() : 0
        );
    }
}
