package com.SGPPiedrazul.controller;

import com.SGPPiedrazul.model.Usuario;
import com.SGPPiedrazul.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id,
                                               @RequestBody Usuario datos,
                                               @RequestHeader("X-Usuario-Responsable") String responsable) {
        return ResponseEntity.ok(usuarioService.actualizar(id, datos, responsable));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id,
                                            @RequestHeader("X-Usuario-Responsable") String responsable) {
        usuarioService.desactivar(id, responsable);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<String> verificarEmail(@RequestParam String token) {
        boolean verificado = usuarioService.verificarEmail(token);
        if (verificado) {
            return ResponseEntity.ok("Email verificado correctamente.");
        }
        return ResponseEntity.badRequest().body("Token inválido o expirado.");
    }
}
