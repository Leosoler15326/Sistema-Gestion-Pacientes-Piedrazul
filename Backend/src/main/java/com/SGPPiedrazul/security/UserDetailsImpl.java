package com.SGPPiedrazul.security;

import com.SGPPiedrazul.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String nombreCompleto;
    private final String rol;
    private final boolean activo;
    private final List<GrantedAuthority> authorities;

    public UserDetailsImpl(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getNombreUsuario();
        this.password = usuario.getContrasena();
        this.nombreCompleto = usuario.getNombreCompleto();
        this.rol = usuario.getRol().name();
        this.activo = usuario.getEstado().name().equals("ACTIVO");
        this.authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
        );
    }

    public Long getId() { return id; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getRol() { return rol; }

    @Override public String getUsername() { return username; }
    @Override public String getPassword() { return password; }
    @Override public List<GrantedAuthority> getAuthorities() { return authorities; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return activo; }
}