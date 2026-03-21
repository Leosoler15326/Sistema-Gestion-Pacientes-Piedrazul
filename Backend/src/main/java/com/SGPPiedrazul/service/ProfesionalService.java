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

        // 1. Construir y guardar el Profesional
        Profesional profesional = new Profesional();
        profesional.setNombres(dto.getNombres());
        profesional.setTipo(dto.getTipo());
        profesional.setEspecialidad(dto.getEspecialidad());
        profesional.setIntervaloMinutos(dto.getIntervaloMinutos());
        profesional.setEstado(Estado.ACTIVO);

        Profesional guardado = profesionalRepository.save(profesional);

        // 2. Si se pidió crear usuario, lo crea y vincula en la misma transacción
        if (Boolean.TRUE.equals(dto.getCrearUsuario())) {

            validarDatosUsuario(dto);

            Usuario usuario = new Usuario();
            usuario.setNombreUsuario(dto.getNombreUsuario());
            usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
            usuario.setNombreCompleto(dto.getNombres()); // usa el nombre del profesional
            usuario.setEmail(dto.getNombreUsuario() + "@hospital.local"); // email temporal
            usuario.setRol(RolUsuario.MEDICO_TERAPISTA);
            usuario.setEstado(Estado.ACTIVO);
            usuario.setEmailVerificado(true);

            Usuario usuarioGuardado = usuarioRepository.save(usuario);

            // Vincular
            guardado.setUsuario(usuarioGuardado);
            profesionalRepository.save(guardado);

            auditoriaService.registrar(TipoEvento.PROFESIONAL_CREADO,
                    "Profesional creado con usuario vinculado: " + guardado.getNombres()
                    + " -> usuario: " + usuarioGuardado.getNombreUsuario(),
                    usuarioResponsable);

            auditoriaService.registrar(TipoEvento.USUARIO_CREADO,
                    "Usuario creado para profesional: " + usuarioGuardado.getNombreUsuario(),
                    usuarioResponsable);

            return ProfesionalResponseDTO.conUsuario(guardado);
        }

        // Sin usuario
        auditoriaService.registrar(TipoEvento.PROFESIONAL_CREADO,
                "Profesional creado sin usuario: " + guardado.getNombres(),
                usuarioResponsable);

        return ProfesionalResponseDTO.sinUsuario(guardado);
    }

    // ─── Validaciones para la creación del usuario ───
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

    // ─── Actualizar datos clínicos del profesional ───
    @Transactional
    public Profesional actualizar(Long id, Profesional datosNuevos, String usuarioResponsable) {
        Profesional profesional = buscarPorId(id);

        profesional.setNombres(datosNuevos.getNombres());
        profesional.setTipo(datosNuevos.getTipo());
        profesional.setEspecialidad(datosNuevos.getEspecialidad());
        profesional.setIntervaloMinutos(datosNuevos.getIntervaloMinutos());

        Profesional actualizado = profesionalRepository.save(profesional);

        auditoriaService.registrar(TipoEvento.PROFESIONAL_MODIFICADO,
                "Profesional modificado: " + profesional.getNombres(), usuarioResponsable);

        return actualizado;
    }

    @Transactional
    public void cambiarEstado(Long id, Estado nuevoEstado, String usuarioResponsable) {
        Profesional profesional = buscarPorId(id);
        profesional.setEstado(nuevoEstado);
        profesionalRepository.save(profesional);

        auditoriaService.registrar(TipoEvento.PROFESIONAL_MODIFICADO,
                "Estado del profesional " + profesional.getNombres()
                + " cambiado a: " + nuevoEstado, usuarioResponsable);
    }

    @Transactional
    public void actualizarFranjas(Long profesionalId, List<FranjaHoraria> nuevasFranjas) {
        Profesional profesional = buscarPorId(profesionalId);
        franjaHorariaRepository.deleteByProfesionalId(profesionalId);
        nuevasFranjas.forEach(f -> f.setProfesional(profesional));
        franjaHorariaRepository.saveAll(nuevasFranjas);
    }

    public Profesional buscarPorId(Long id) {
        return profesionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Profesional no encontrado con id: " + id));
    }

    public List<Profesional> listarTodos() {
        return profesionalRepository.findAll();
    }

    public List<Profesional> listarActivos() {
        return profesionalRepository.findByEstado(Estado.ACTIVO);
    }

    public List<Profesional> listarPorEspecialidad(Especialidad especialidad) {
        return profesionalRepository.findByEspecialidadAndEstado(especialidad, Estado.ACTIVO);
    }

    public List<FranjaHoraria> listarFranjas(Long profesionalId) {
        return franjaHorariaRepository.findByProfesionalId(profesionalId);
    }
}