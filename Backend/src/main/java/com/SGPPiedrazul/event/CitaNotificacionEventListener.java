package com.SGPPiedrazul.event;

import com.SGPPiedrazul.service.NotificacionService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CitaNotificacionEventListener {

    private final NotificacionService notificacionService;

    public CitaNotificacionEventListener(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @EventListener
    public void onCitaAgendada(CitaAgendadaEvent event) {
        notificacionService.enviarConfirmacionCita(event.cita());
    }

    @EventListener
    public void onCitaReagendada(CitaReagendadaEvent event) {
        notificacionService.enviarConfirmacionReagendamiento(event.cita());
    }
}
