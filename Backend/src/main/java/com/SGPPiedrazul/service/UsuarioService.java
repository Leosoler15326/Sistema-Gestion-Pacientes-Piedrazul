package com.SGPPiedrazul.service;
 
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.UUID;
 
@Service
public class UsuarioService {
 
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;
 
    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          AuditoriaService auditoriaService,
                          NotificacionService notificacionService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
        this.notificacionService = notificacionService;
    }
 
    @Transactional
    public Usuario crear(Usuario usuario) {
        if (usuarioRepository.existsByNombreUsuario(usuario.getNombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }
 
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setEstado(Estado.ACTIVO);
        usuario.setEmailVerificado(true);
        usuario.setTokenVerificacion(null);
 
        Usuario guardado = usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_CREADO,
                "Usuario creado: " + guardado.getNombreUsuario(), guardado.getNombreUsuario());
 
        return guardado;
    }
 
    @Transactional
    public Usuario actualizar(Long id, Usuario datosNuevos, String usuarioResponsable) {
        Usuario usuario = buscarPorId(id);
 
        usuario.setNombreCompleto(datosNuevos.getNombreCompleto());
        usuario.setEmail(datosNuevos.getEmail());
        usuario.setRol(datosNuevos.getRol());
 
        Usuario actualizado = usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_MODIFICADO,
                "Usuario modificado: " + usuario.getNombreUsuario(), usuarioResponsable);
 
        return actualizado;
    }
 
    @Transactional
    public void desactivar(Long id, String usuarioResponsable) {
        Usuario usuario = buscarPorId(id);
        usuario.setEstado(Estado.INACTIVO);
        usuarioRepository.save(usuario);
 
        auditoriaService.registrar(TipoEvento.USUARIO_DESACTIVADO,
                "Usuario desactivado: " + usuario.getNombreUsuario(), usuarioResponsable);
    }
 
    @Transactional
    public boolean verificarEmail(String token) {
        return usuarioRepository.findByTokenVerificacion(token).map(usuario -> {
            usuario.setEmailVerificado(true);
            usuario.setTokenVerificacion(null);
            usuarioRepository.save(usuario);
            return true;
        }).orElse(false);
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
 
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }
 
    public Usuario buscarPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + nombreUsuario));
    }
 
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
 
    public List<Usuario> listarActivos() {
        return usuarioRepository.findByEstado(Estado.ACTIVO);
    }
}