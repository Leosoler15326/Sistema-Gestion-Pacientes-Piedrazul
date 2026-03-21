package com.SGPPiedrazul.model;

import com.SGPPiedrazul.model.enums.TipoEvento;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false)
    private TipoEvento tipoEvento;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "nombre_usuario_responsable", length = 100)
    private String nombreUsuarioResponsable;

    @Column(name = "fecha_evento", nullable = false, updatable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "ip_origen", length = 50)
    private String ipOrigen;

    @PrePersist
    protected void onCreate() {
        fechaEvento = LocalDateTime.now();
    }

    // ─── Getters y Setters ───
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoEvento getTipoEvento() { return tipoEvento; }
    public void setTipoEvento(TipoEvento tipoEvento) { this.tipoEvento = tipoEvento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getNombreUsuarioResponsable() { return nombreUsuarioResponsable; }
    public void setNombreUsuarioResponsable(String nombreUsuarioResponsable) { this.nombreUsuarioResponsable = nombreUsuarioResponsable; }

    public LocalDateTime getFechaEvento() { return fechaEvento; }

    public String getIpOrigen() { return ipOrigen; }
    public void setIpOrigen(String ipOrigen) { this.ipOrigen = ipOrigen; }
}
