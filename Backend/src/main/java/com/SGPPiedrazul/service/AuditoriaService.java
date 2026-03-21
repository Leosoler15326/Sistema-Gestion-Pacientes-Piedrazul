package com.SGPPiedrazul.service;

import com.SGPPiedrazul.model.Auditoria;
import com.SGPPiedrazul.model.enums.TipoEvento;
import com.SGPPiedrazul.repository.AuditoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    public void registrar(TipoEvento tipoEvento, String descripcion, String nombreUsuario) {
        Auditoria auditoria = new Auditoria();
        auditoria.setTipoEvento(tipoEvento);
        auditoria.setDescripcion(descripcion);
        auditoria.setNombreUsuarioResponsable(nombreUsuario);
        auditoriaRepository.save(auditoria);
    }

    public void registrar(TipoEvento tipoEvento, String descripcion, String nombreUsuario, String ip) {
        Auditoria auditoria = new Auditoria();
        auditoria.setTipoEvento(tipoEvento);
        auditoria.setDescripcion(descripcion);
        auditoria.setNombreUsuarioResponsable(nombreUsuario);
        auditoria.setIpOrigen(ip);
        auditoriaRepository.save(auditoria);
    }

    public List<Auditoria> listarTodos() {
        return auditoriaRepository.findAll();
    }

    public List<Auditoria> listarPorUsuario(String nombreUsuario) {
        return auditoriaRepository.findByNombreUsuarioResponsable(nombreUsuario);
    }

    public List<Auditoria> listarPorTipoEvento(TipoEvento tipoEvento) {
        return auditoriaRepository.findByTipoEvento(tipoEvento);
    }
}
