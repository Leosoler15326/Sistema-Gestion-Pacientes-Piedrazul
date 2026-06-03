package com.SGPPiedrazul.acceptance;

import com.SGPPiedrazul.model.ConfiguracionAgendamiento;
import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.model.enums.RolUsuario;
import com.SGPPiedrazul.repository.ConfiguracionAgendamientoRepository;
import com.SGPPiedrazul.repository.UsuarioRepository;
import com.SGPPiedrazul.security.UserDetailsImpl;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class Hooks {

    private static final String ADMIN_ACC = "acc_admin_hooks";

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ConfiguracionAgendamientoRepository configuracionRepository;

    @Before(order = 0)
    public void configurarContexto() {
        // ConfiguracionAgendamiento requerida por CitaService.validarDiaDentroDeVentana
        if (!configuracionRepository.existsById(ConfiguracionAgendamiento.SINGLETON_ID)) {
            configuracionRepository.save(new ConfiguracionAgendamiento());
        }

        // Usuario admin para el SecurityContext (requerido por SecurityUtils en CitaService)
        Usuario admin = usuarioRepository.findByNombreUsuario(ADMIN_ACC)
                .orElseGet(() -> {
                    Usuario u = new Usuario();
                    u.setNombreUsuario(ADMIN_ACC);
                    u.setContrasena(passwordEncoder.encode("TestPass123!"));
                    u.setNombreCompleto("Admin Acceptance Tests");
                    u.setEmail("acc_admin@acc.test");
                    u.setRol(RolUsuario.ADMINISTRADOR);
                    u.setEmailVerificado(true);
                    return usuarioRepository.save(u);
                });

        UserDetailsImpl principal = new UserDetailsImpl(admin);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @After(order = 0)
    public void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }
}
