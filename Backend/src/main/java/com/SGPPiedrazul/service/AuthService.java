package com.SGPPiedrazul.service;
 
import com.SGPPiedrazul.dto.AuthDTO;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.Estado;
import com.SGPPiedrazul.model.enums.RolUsuario;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.JwtService;
import com.SGPPiedrazul.security.UserDetailsImpl;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
@Service
public class AuthService {
 
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;
 
    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsServiceImpl userDetailsService,
                       AuditoriaService auditoriaService,
                       NotificacionService notificacionService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.auditoriaService = auditoriaService;
        this.notificacionService = notificacionService;
    }
 
    // ─── Login ───
    public AuthDTO.TokenResponse login(AuthDTO.LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getNombreUsuario(),
                            request.getContrasena()
                    )
            );
        } catch (BadCredentialsException e) {
            // Registra intento fallido sin exponer detalles
            auditoriaService.registrar(TipoEvento.LOGIN_FALLIDO,
                    "Intento fallido de login para: " + request.getNombreUsuario(),
                    request.getNombreUsuario());
            throw new BadCredentialsException("Credenciales inválidas.");
        }
 
        UserDetailsImpl userDetails = (UserDetailsImpl)
                userDetailsService.loadUserByUsername(request.getNombreUsuario());
 
        String accessToken = jwtService.generarToken(userDetails);
        String refreshToken = jwtService.generarRefreshToken(userDetails);
 
        auditoriaService.registrar(TipoEvento.LOGIN_EXITOSO,
                "Login exitoso para: " + userDetails.getUsername(),
                userDetails.getUsername());
 
        return new AuthDTO.TokenResponse(
                accessToken,
                refreshToken,
                userDetails.getUsername(),
                userDetails.getNombreCompleto(),
                userDetails.getRol(),
                userDetails.getId()
        );
    }
 
    // ─── Registro ───
    @Transactional
    public AuthDTO.TokenResponse registro(AuthDTO.RegistroRequest request) {
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }
 
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setRol(RolUsuario.valueOf(request.getRol()));
        usuario.setEstado(Estado.ACTIVO);
        usuario.setEmailVerificado(true);   // sin verificación por email
        usuario.setTokenVerificacion(null);
 
        Usuario guardado = usuarioRepository.save(usuario);
 
        notificacionService.enviarVerificacionEmail(guardado, null);
        auditoriaService.registrar(TipoEvento.USUARIO_CREADO,
                "Nuevo usuario registrado: " + guardado.getNombreUsuario(),
                guardado.getNombreUsuario());
 
        UserDetailsImpl userDetails = new UserDetailsImpl(guardado);
        String accessToken = jwtService.generarToken(userDetails);
        String refreshToken = jwtService.generarRefreshToken(userDetails);
 
        return new AuthDTO.TokenResponse(
                accessToken,
                refreshToken,
                userDetails.getUsername(),
                userDetails.getNombreCompleto(),
                userDetails.getRol(),
                userDetails.getId()
        );
    }
 
    // ─── Refresh Token ───
    public AuthDTO.TokenResponse refreshToken(String refreshToken) {
        String nombreUsuario = jwtService.extraerNombreUsuario(refreshToken);
        UserDetailsImpl userDetails = (UserDetailsImpl)
                userDetailsService.loadUserByUsername(nombreUsuario);
 
        if (!jwtService.esTokenValido(refreshToken, userDetails)) {
            throw new RuntimeException("Refresh token inválido o expirado.");
        }
 
        String nuevoAccessToken = jwtService.generarToken(userDetails);
        return new AuthDTO.TokenResponse(
                nuevoAccessToken,
                refreshToken,
                userDetails.getUsername(),
                userDetails.getNombreCompleto(),
                userDetails.getRol(),
                userDetails.getId()
        );
    }
 
    // ─── Cambiar contraseña (usuario autenticado) ───
    @Transactional
    public void cambiarContrasena(AuthDTO.CambiarContrasenaRequest dto) {
        String nombreUsuario = com.SGPPiedrazul.security.SecurityUtils.getNombreUsuarioActual();
        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!passwordEncoder.matches(dto.getContrasenaActual(), usuario.getContrasena())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta.");
        }
        usuario.setContrasena(passwordEncoder.encode(dto.getNuevaContrasena()));
        usuarioRepository.save(usuario);

        auditoriaService.registrar(TipoEvento.USUARIO_MODIFICADO,
                "Contraseña cambiada por el propio usuario: " + nombreUsuario, nombreUsuario);
    }

    // ─── Recuperar contraseña (sin sesión, verifica cédula + correo) ───
    @Transactional
    public void recuperarContrasena(AuthDTO.RecuperarContrasenaRequest dto) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(dto.getNombreUsuario())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró una cuenta con esa cédula y correo."));

        if (!dto.getEmail().equalsIgnoreCase(usuario.getEmail())) {
            throw new IllegalArgumentException(
                    "No se encontró una cuenta con esa cédula y correo.");
        }
        usuario.setContrasena(passwordEncoder.encode(dto.getNuevaContrasena()));
        usuarioRepository.save(usuario);

        auditoriaService.registrar(TipoEvento.USUARIO_MODIFICADO,
                "Contraseña recuperada para: " + usuario.getNombreUsuario(),
                usuario.getNombreUsuario());
    }

    // ─── Verificación de email ───
    @Transactional
    public boolean verificarEmail(String token) {
        return usuarioRepository.findByTokenVerificacion(token).map(usuario -> {
            usuario.setEmailVerificado(true);
            usuario.setTokenVerificacion(null);
            usuarioRepository.save(usuario);
            return true;
        }).orElse(false);
    }
}