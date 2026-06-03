package com.SGPPiedrazul.event;

import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.service.AuditoriaService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * SRP: reacciona a eventos de citas solo para auditoría (Open/Closed: nuevos listeners sin tocar el servicio).
 */
@Component
public class CitaAuditoriaEventListener {

    private final AuditoriaService auditoriaService;

    public CitaAuditoriaEventListener(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @EventListener
    public void onCitaAgendada(CitaAgendadaEvent event) {
        auditoriaService.registrar(
                TipoEvento.CITA_AGENDADA,
                event.detalleAuditoria(),
                event.nombreUsuarioActor());
    }

    @EventListener
    public void onCitaReagendada(CitaReagendadaEvent event) {
        auditoriaService.registrar(
                TipoEvento.CITA_REAGENDADA,
                event.detalleAuditoria(),
                event.nombreUsuarioActor());
    }

    @EventListener
    public void onCitaCancelada(CitaCanceladaEvent event) {
        auditoriaService.registrar(
                TipoEvento.CITA_CANCELADA,
                "Cita " + event.citaId() + " cancelada. Motivo: " + event.motivo(),
                event.nombreUsuarioActor());
    }
}
