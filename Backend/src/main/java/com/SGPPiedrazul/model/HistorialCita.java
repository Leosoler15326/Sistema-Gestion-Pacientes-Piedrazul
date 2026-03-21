package com.SGPPiedrazul.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_citas")
public class HistorialCita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id", nullable = false)
    private Cita cita;

    @Column(name = "fecha_anterior", nullable = false)
    private LocalDateTime fechaAnterior;

    @Column(name = "fecha_nueva", nullable = false)
    private LocalDateTime fechaNueva;

    @Column(name = "motivo", length = 300)
    private String motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id")
    private Usuario responsable;

    @Column(name = "fecha_cambio", nullable = false, updatable = false)
    private LocalDateTime fechaCambio;

    @PrePersist
    protected void onCreate() {
        fechaCambio = LocalDateTime.now();
    }

    // ─── Getters y Setters ───
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cita getCita() { return cita; }
    public void setCita(Cita cita) { this.cita = cita; }

    public LocalDateTime getFechaAnterior() { return fechaAnterior; }
    public void setFechaAnterior(LocalDateTime fechaAnterior) { this.fechaAnterior = fechaAnterior; }

    public LocalDateTime getFechaNueva() { return fechaNueva; }
    public void setFechaNueva(LocalDateTime fechaNueva) { this.fechaNueva = fechaNueva; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public Usuario getResponsable() { return responsable; }
    public void setResponsable(Usuario responsable) { this.responsable = responsable; }

    public LocalDateTime getFechaCambio() { return fechaCambio; }
}
