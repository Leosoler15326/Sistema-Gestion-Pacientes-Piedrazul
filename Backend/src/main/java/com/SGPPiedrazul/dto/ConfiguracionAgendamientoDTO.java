package com.SGPPiedrazul.dto;

public class ConfiguracionAgendamientoDTO {

    private int ventanaSemanasAgendar;

    public ConfiguracionAgendamientoDTO() {}

    public ConfiguracionAgendamientoDTO(int ventanaSemanasAgendar) {
        this.ventanaSemanasAgendar = ventanaSemanasAgendar;
    }

    public int getVentanaSemanasAgendar() {
        return ventanaSemanasAgendar;
    }

    public void setVentanaSemanasAgendar(int ventanaSemanasAgendar) {
        this.ventanaSemanasAgendar = ventanaSemanasAgendar;
    }
}
