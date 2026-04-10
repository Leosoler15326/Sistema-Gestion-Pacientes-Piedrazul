package com.SGPPiedrazul.model;

import jakarta.persistence.*;

@Entity
@Table(name = "configuracion_agendamiento")
public class ConfiguracionAgendamiento {

    public static final long SINGLETON_ID = 1L;

    @Id
    @Column(name = "id")
    private Long id = SINGLETON_ID;

    @Column(name = "ventana_semanas", nullable = false)
    private Integer ventanaSemanasAgendar = 8;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVentanaSemanasAgendar() {
        return ventanaSemanasAgendar;
    }

    public void setVentanaSemanasAgendar(Integer ventanaSemanasAgendar) {
        this.ventanaSemanasAgendar = ventanaSemanasAgendar;
    }
}
