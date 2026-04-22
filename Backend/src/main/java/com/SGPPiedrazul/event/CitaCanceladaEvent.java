package com.SGPPiedrazul.event;

public record CitaCanceladaEvent(Long citaId, String motivo, String nombreUsuarioActor) {
}
