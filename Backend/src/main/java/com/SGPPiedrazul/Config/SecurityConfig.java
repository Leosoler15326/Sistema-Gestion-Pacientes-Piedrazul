package com.SGPPiedrazul.Config;

import com.SGPPiedrazul.security.JwtAuthFilter;
import com.SGPPiedrazul.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // habilita @PreAuthorize en los controllers
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          UserDetailsServiceImpl userDetailsService,
                          CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Rutas públicas — no requieren token
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/registro",
                    "/api/auth/verificar-email",
                    "/api/health",
                    "/api/hash"
                ).permitAll()

                // Solo ADMINISTRADOR
                .requestMatchers("/api/usuarios/**").hasAnyRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/api/profesionales/**").hasAnyRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/profesionales/**").hasAnyRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/profesionales/**").hasAnyRole("ADMINISTRADOR")

                // Citas — ADMINISTRADOR, AGENDADOR, MEDICO_TERAPISTA pueden crear/reagendar/cancelar; PACIENTE solo crear
                .requestMatchers("/api/citas/**").hasAnyRole("ADMINISTRADOR", "AGENDADOR", "MEDICO_TERAPISTA")

                // Historias clínicas — solo MEDICO_TERAPISTA
                .requestMatchers("/api/historias/**").hasAnyRole("MEDICO_TERAPISTA")

                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}