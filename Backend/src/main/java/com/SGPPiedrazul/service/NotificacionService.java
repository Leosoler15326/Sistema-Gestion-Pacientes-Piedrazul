package com.SGPPiedrazul.service;

import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Usuario;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class NotificacionService {

    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy 'a las' HH:mm");

    // Sin canal de notificación externo por ahora.
    // Preparado para agregar SMS, WhatsApp u otro canal en el futuro.

    public void enviarConfirmacionCita(Cita cita) {
        System.out.println("[NOTIFICACION] Cita confirmada — Paciente: "
                + cita.getPaciente().getNombres()
                + " | Profesional: " + cita.getProfesional().getNombres()
                + " | Fecha: " + cita.getFechaHora().format(FORMATO_FECHA));
    }

    public void enviarConfirmacionReagendamiento(Cita cita) {
        System.out.println("[NOTIFICACION] Cita reagendada — Paciente: "
                + cita.getPaciente().getNombres()
                + " | Nueva fecha: " + cita.getFechaHora().format(FORMATO_FECHA));
    }

    public void enviarVerificacionEmail(Usuario usuario, String token) {
        // Sin verificación por email — el usuario queda activo directamente tras registro
        System.out.println("[NOTIFICACION] Usuario registrado: " + usuario.getNombreUsuario());
    }
}