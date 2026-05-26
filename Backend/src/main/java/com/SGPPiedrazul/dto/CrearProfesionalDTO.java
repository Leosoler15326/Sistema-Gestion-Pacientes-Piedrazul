package com.SGPPiedrazul.dto;

import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.TipoProfesional;

public class CrearProfesionalDTO {

    // ─── Datos del Profesional (siempre requeridos) ───
    private String nombres;
    private TipoProfesional tipo;
    private Especialidad especialidad;
    private Integer intervaloMinutos;

    private String habilidadesAdicionales;

    // ─── Datos del Usuario (opcionales) ───
    // Si crearUsuario = true, se crea la cuenta y se vincula automáticamente
    private Boolean crearUsuario = false;
    private String nombreUsuario;
    private String contrasena;

    // ─── Getters y Setters ───
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public TipoProfesional getTipo() { return tipo; }
    public void setTipo(TipoProfesional tipo) { this.tipo = tipo; }

    public Especialidad getEspecialidad() { return especialidad; }
    public void setEspecialidad(Especialidad especialidad) { this.especialidad = especialidad; }

    public Integer getIntervaloMinutos() { return intervaloMinutos; }
    public void setIntervaloMinutos(Integer intervaloMinutos) { this.intervaloMinutos = intervaloMinutos; }

    public String getHabilidadesAdicionales() { return habilidadesAdicionales; }
    public void setHabilidadesAdicionales(String v) { this.habilidadesAdicionales = v; }

    public Boolean getCrearUsuario() { return crearUsuario; }
    public void setCrearUsuario(Boolean crearUsuario) { this.crearUsuario = crearUsuario; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}