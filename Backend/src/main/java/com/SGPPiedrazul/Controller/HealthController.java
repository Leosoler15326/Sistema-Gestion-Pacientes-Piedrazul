package com.SGPPiedrazul.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
            "status", "ok",
            "message", "Backend funcionando"
        );
    }

    @GetMapping("/hash")
    public String generarHash(@RequestParam String texto) {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(texto);
    }
}