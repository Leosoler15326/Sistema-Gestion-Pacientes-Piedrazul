package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.CrearProfesionalDTO;
import com.SGPPiedrazul.dto.ProfesionalResponseDTO;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.model.enums.RolUsuario;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.FranjaHorariaRepository;
import com.SGPPiedrazul.repository.ProfesionalRepository;
import com.SGPPiedrazul.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;
    private final FranjaHorariaRepository franjaHorariaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public ProfesionalService(ProfesionalRepository profesionalRepository,
                               FranjaHorariaRepository franjaHorariaRepository,
                               UsuarioRepository usuarioRepository,
                               PasswordEncoder passwordEncoder,
                               AuditoriaService auditoriaService) {
        this.profesionalRepository = profesionalRepository;
        this.franjaHorariaRepository = franjaHorariaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    // ─── Crear profesional (con o sin usuario en una sola transacción) ───
    @Transactional
    public ProfesionalResponseDTO crear(CrearProfesionalDTO dto, String usuarioResponsable) {

        Profesional profesional = new Profesional();
        profesional.setNombres(dto.getNombres());
        profesional.setTipo(dto.getTipo());
        profesional.setEspecialidad(dto.getEspecialidad());
        profesional.setIntervaloMinutos(dto.getIntervaloMinutos());
        profesional.setHabilidadesAdicionales(dto.getHabilidadesAdicionales());
        profesional.setEstado(Estado.ACTIVO);

        Profesional guardado = profesionalRepository.save(profesional);

        if (Boolean.TRUE.equals(dto.getCrearUsuario())) {
            validarDatosUsuario(dto);

            Usuario usuario = new Usuario();
            usuario.setNombreUsuario(dto.getNombreUsuario());
            usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
            usuario.setNombreCompleto(dto.getNombres());
            usuario.setEmail(dto.getNombreUsuario() + "@hospital.local");
            usuario.setRol(RolUsuario.MEDICO_TERAPISTA);
            usuario.setEstado(Estado.ACTIVO);
            usuario.setEmailVerificado(true);

            Usuario usuarioGuardado = usuarioRepository.save(usuario);

            guardado.setUsuario(usuarioGuardado);
            profesionalRepository.save(guardado);

            auditoriaService.registrar(TipoEvento.PROFESIONAL_CREADO,
                    "Profesional creado con usuario: " + guardado.getNombres()
                    + " -> " + usuarioGuardado.getNombreUsuario(),
                    usuarioResponsable);

            auditoriaService.registrar(TipoEvento.USUARIO_CREADO,
                    "Usuario creado para profesional: " + usuarioGuardado.getNombreUsuario(),
                    usuarioResponsable);

            return ProfesionalResponseDTO.conUsuario(guardado);
        }

        auditoriaService.registrar(TipoEvento.PROFESIONAL_CREADO,
                "Profesional creado sin usuario: " + guardado.getNombres(),
                usuarioResponsable);

        return ProfesionalResponseDTO.sinUsuario(guardado);
    }

    // ─── Actualizar datos clínicos ───
    @Transactional
    public ProfesionalResponseDTO actualizar(Long id, CrearProfesionalDTO dto,
                                              String usuarioResponsable) {
        Profesional profesional = buscarEntidadPorId(id);

        profesional.setNombres(dto.getNombres());
        profesional.setTipo(dto.getTipo());
        profesional.setEspecialidad(dto.getEspecialidad());
        profesional.setIntervaloMinutos(dto.getIntervaloMinutos());
        profesional.setHabilidadesAdicionales(dto.getHabilidadesAdicionales());

        Profesional actualizado = profesionalRepository.save(profesional);

        auditoriaService.registrar(TipoEvento.PROFESIONAL_MODIFICADO,
                "Profesional modificado: " + profesional.getNombres(),
                usuarioResponsable);

        return actualizado.getUsuario() != null
                ? ProfesionalResponseDTO.conUsuario(actualizado)
                : ProfesionalResponseDTO.sinUsuario(actualizado);
    }

    // ─── Cambiar estado ───
    @Transactional
    public void cambiarEstado(Long id, Estado nuevoEstado, String usuarioResponsable) {
        Profesional profesional = buscarEntidadPorId(id);
        profesional.setEstado(nuevoEstado);
        profesionalRepository.save(profesional);

        // Si el profesional tiene usuario vinculado, sincronizar su estado
        if (profesional.getUsuario() != null) {
            Usuario usuario = profesional.getUsuario();
            usuario.setEstado(nuevoEstado);
            usuarioRepository.save(usuario);

            auditoriaService.registrar(TipoEvento.USUARIO_MODIFICADO,
                    "Usuario " + usuario.getNombreUsuario()
                    + " " + (nuevoEstado == Estado.ACTIVO ? "activado" : "desactivado")
                    + " al cambiar estado del profesional " + profesional.getNombres(),
                    usuarioResponsable);
        }

        auditoriaService.registrar(TipoEvento.PROFESIONAL_MODIFICADO,
                "Estado del profesional " + profesional.getNombres()
                + " cambiado a: " + nuevoEstado,
                usuarioResponsable);
    }

    // ─── Franjas horarias ───
    @Transactional
    public void actualizarFranjas(Long profesionalId, List<FranjaHoraria> nuevasFranjas) {
        Profesional profesional = buscarEntidadPorId(profesionalId);
        franjaHorariaRepository.deleteByProfesionalId(profesionalId);
        nuevasFranjas.forEach(f -> f.setProfesional(profesional));
        franjaHorariaRepository.saveAll(nuevasFranjas);
    }

    // ─── Consultas ───
    @Transactional(readOnly = true)
    public ProfesionalResponseDTO buscarPorIdDTO(Long id) {
        Profesional p = buscarEntidadPorId(id);
        return p.getUsuario() != null
                ? ProfesionalResponseDTO.conUsuario(p)
                : ProfesionalResponseDTO.sinUsuario(p);
    }

    @Transactional(readOnly = true)
    public ProfesionalResponseDTO buscarPorUsuarioId(Long usuarioId) {
        Profesional profesional = profesionalRepository.findByUsuarioId(usuarioId);
        return ProfesionalResponseDTO.conUsuario(profesional);
    }

    @Transactional(readOnly = true)
    public List<ProfesionalResponseDTO> listarTodos() {
        return profesionalRepository.findAll().stream()
                .map(p -> p.getUsuario() != null
                        ? ProfesionalResponseDTO.conUsuario(p)
                        : ProfesionalResponseDTO.sinUsuario(p))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfesionalResponseDTO> listarActivos() {
        return profesionalRepository.findByEstado(Estado.ACTIVO).stream()
                .map(p -> p.getUsuario() != null
                        ? ProfesionalResponseDTO.conUsuario(p)
                        : ProfesionalResponseDTO.sinUsuario(p))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfesionalResponseDTO> listarPorEspecialidad(Especialidad especialidad) {
        return profesionalRepository.findByEspecialidadAndEstado(especialidad, Estado.ACTIVO)
                .stream()
                .map(p -> p.getUsuario() != null
                        ? ProfesionalResponseDTO.conUsuario(p)
                        : ProfesionalResponseDTO.sinUsuario(p))
                .collect(Collectors.toList());
    }

    public List<FranjaHoraria> listarFranjas(Long profesionalId) {
        return franjaHorariaRepository.findByProfesionalId(profesionalId);
    }

    // ─── Acceso interno ───
    public Profesional buscarEntidadPorId(Long id) {
        return profesionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Profesional no encontrado con id: " + id));
    }

    // ─── Validaciones ───
    private void validarDatosUsuario(CrearProfesionalDTO dto) {
        if (dto.getNombreUsuario() == null || dto.getNombreUsuario().isBlank()) {
            throw new IllegalArgumentException(
                    "El nombre de usuario es requerido cuando crearUsuario es true.");
        }
        if (dto.getContrasena() == null || dto.getContrasena().isBlank()) {
            throw new IllegalArgumentException(
                    "La contraseña es requerida cuando crearUsuario es true.");
        }
        if (usuarioRepository.existsByNombreUsuario(dto.getNombreUsuario())) {
            throw new IllegalArgumentException(
                    "El nombre de usuario '" + dto.getNombreUsuario() + "' ya está en uso.");
        }
    }
}