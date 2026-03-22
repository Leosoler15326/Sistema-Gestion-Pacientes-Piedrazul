package com.SGPPiedrazul.service;
 
import com.SGPPiedrazul.dto.UsuarioDTO;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class UsuarioService {
 
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;
 
    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          AuditoriaService auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public UsuarioDTO.Response crear(UsuarioDTO.Request dto, String responsable) {
        if (usuarioRepository.existsByNombreUsuario(dto.getNombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }
 
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setEmail(dto.getEmail());
        usuario.setRol(dto.getRol());
        usuario.setEstado(Estado.ACTIVO);
        usuario.setEmailVerificado(true);
 
        Usuario guardado = usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_CREADO,
                "Usuario creado: " + guardado.getNombreUsuario(), responsable);
 
        return toResponse(guardado);
    }
 
    @Transactional
    public UsuarioDTO.Response actualizar(Long id, UsuarioDTO.ActualizarRequest dto,
                                           String responsable) {
        Usuario usuario = buscarEntidadPorId(id);
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setEmail(dto.getEmail());
        usuario.setRol(dto.getRol());
        Usuario actualizado = usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_MODIFICADO,
                "Usuario modificado: " + usuario.getNombreUsuario(), responsable);
 
        return toResponse(actualizado);
    }
 


    @Transactional
    public void desactivar(Long id, String responsable) {
        Usuario usuario = buscarEntidadPorId(id);
        usuario.setEstado(Estado.INACTIVO);
        usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_DESACTIVADO,
                "Usuario desactivado: " + usuario.getNombreUsuario(), responsable);
    }
 
    @Transactional
    public void registrarIntentoFallidoLogin(String nombreUsuario) {
        usuarioRepository.findByNombreUsuario(nombreUsuario).ifPresent(usuario -> {
            usuario.setIntentosFallidosLogin(usuario.getIntentosFallidosLogin() + 1);
            usuarioRepository.save(usuario);
            auditoriaService.registrar(TipoEvento.LOGIN_FALLIDO,
                    "Intento fallido de login para: " + nombreUsuario, nombreUsuario);
        });
    }
 


     @Transactional(readOnly = true)
    public UsuarioDTO.Response buscarPorId(Long id) {
        return toResponse(buscarEntidadPorId(id));
    }
 
    @Transactional(readOnly = true)
    public List<UsuarioDTO.Response> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }
 
    @Transactional(readOnly = true)
    public List<UsuarioDTO.Response> listarActivos() {
        return usuarioRepository.findByEstado(Estado.ACTIVO).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }
 
    public Usuario buscarEntidadPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado con id: " + id));
    }
 
    public Usuario buscarEntidadPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado: " + nombreUsuario));
    }
 
    private UsuarioDTO.Response toResponse(Usuario u) {
        return new UsuarioDTO.Response(
                u.getId(),
                u.getNombreUsuario(),
                u.getNombreCompleto(),
                u.getEmail(),
                u.getRol().name(),
                u.getEstado().name(),
                u.getEmailVerificado()
        );
    }
}