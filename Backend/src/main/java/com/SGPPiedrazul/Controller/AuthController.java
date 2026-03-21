package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.dto.AuthDTO;
import com.SGPPiedrazul.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.TokenResponse> login(
            @RequestBody AuthDTO.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthDTO.TokenResponse> registro(
            @RequestBody AuthDTO.RegistroRequest request) {
        return ResponseEntity.ok(authService.registro(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDTO.TokenResponse> refresh(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken")));
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<String> verificarEmail(@RequestParam String token) {
        boolean ok = authService.verificarEmail(token);
        if (ok) return ResponseEntity.ok("Email verificado correctamente.");
        return ResponseEntity.badRequest().body("Token inválido o expirado.");
    }
}
