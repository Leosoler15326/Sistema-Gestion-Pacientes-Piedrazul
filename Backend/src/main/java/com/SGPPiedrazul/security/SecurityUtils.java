package com.SGPPiedrazul.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    private SecurityUtils() {}

    // Retorna el UserDetailsImpl del usuario autenticado en la petición actual
    public static UserDetailsImpl getUsuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No hay usuario autenticado en el contexto.");
        }
        return (UserDetailsImpl) auth.getPrincipal();
    }

    public static String getNombreUsuarioActual() {
        return getUsuarioActual().getUsername();
    }

    public static Long getIdUsuarioActual() {
        return getUsuarioActual().getId();
    }

    public static String getRolUsuarioActual() {
        return getUsuarioActual().getRol();
    }
}
