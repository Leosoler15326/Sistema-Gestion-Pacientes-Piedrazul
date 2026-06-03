package com.SGPPiedrazul.event;

import com.SGPPiedrazul.model.Cita;

/**
 * Evento de dominio tras persistir una cita nueva (Observer / Spring ApplicationEvent).
 */
public record CitaAgendadaEvent(Cita cita, String detalleAuditoria, String nombreUsuarioActor) {
}
