package com.SGPPiedrazul.dto;

import com.SGPPiedrazul.model.Profesional;

public class ProfesionalResponseDTO {

    private Long profesionalId;
    private String nombres;
    private String especialidad;
    private String tipo;
    private Integer intervaloMinutos;
    private String estado;

    // Solo presente si se creó usuario
    private Long usuarioId;
    private String nombreUsuario;
    private String rolUsuario;
    private Boolean usuarioVinculado;

    public static ProfesionalResponseDTO sinUsuario(Profesional p) {
        ProfesionalResponseDTO dto = new ProfesionalResponseDTO();
        dto.profesionalId = p.getId();
        dto.nombres = p.getNombres();
        dto.especialidad = p.getEspecialidad().name();
        dto.tipo = p.getTipo().name();
        dto.intervaloMinutos = p.getIntervaloMinutos();
        dto.estado = p.getEstado().name();
        dto.usuarioVinculado = false;
        return dto;
    }

    public static ProfesionalResponseDTO conUsuario(Profesional p) {
        ProfesionalResponseDTO dto = sinUsuario(p);
        if (p.getUsuario() != null) {
            dto.usuarioId = p.getUsuario().getId();
            dto.nombreUsuario = p.getUsuario().getNombreUsuario();
            dto.rolUsuario = p.getUsuario().getRol().name();
            dto.usuarioVinculado = true;
        }
        return dto;
    }

    // ─── Getters ───
    public Long getProfesionalId() { return profesionalId; }
    public String getNombres() { return nombres; }
    public String getEspecialidad() { return especialidad; }
    public String getTipo() { return tipo; }
    public Integer getIntervaloMinutos() { return intervaloMinutos; }
    public String getEstado() { return estado; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNombreUsuario() { return nombreUsuario; }
    public String getRolUsuario() { return rolUsuario; }
    public Boolean getUsuarioVinculado() { return usuarioVinculado; }
}