package com.SGPPiedrazul.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    // ─── Generación de tokens ───

    public String generarToken(UserDetailsImpl userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userDetails.getId());
        claims.put("rol", userDetails.getRol());
        claims.put("nombreCompleto", userDetails.getNombreCompleto());
        return buildToken(claims, userDetails.getUsername(), expirationMs);
    }

    public String generarRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails.getUsername(), refreshExpirationMs);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    // ─── Extracción de datos ───

    public String extraerNombreUsuario(String token) {
        return extraerClaims(token).getSubject();
    }

    public Long extraerId(String token) {
        return ((Number) extraerClaims(token).get("id")).longValue();
    }

    public String extraerRol(String token) {
        return (String) extraerClaims(token).get("rol");
    }

    // ─── Validación ───

    public boolean esTokenValido(String token, UserDetails userDetails) {
        try {
            String username = extraerNombreUsuario(token);
            return username.equals(userDetails.getUsername()) && !estaExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean estaExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    // ─── Utilidades privadas ───

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
