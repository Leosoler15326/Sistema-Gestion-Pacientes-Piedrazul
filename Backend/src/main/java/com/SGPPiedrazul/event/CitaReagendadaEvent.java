package com.SGPPiedrazul.event;

import com.SGPPiedrazul.model.Cita;

public record CitaReagendadaEvent(Cita cita, String detalleAuditoria, String nombreUsuarioActor) {
}
