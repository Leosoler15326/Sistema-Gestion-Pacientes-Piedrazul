package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.Auditoria;
import com.SGPPiedrazul.model.enums.TipoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    List<Auditoria> findByNombreUsuarioResponsable(String nombreUsuario);

    List<Auditoria> findByTipoEvento(TipoEvento tipoEvento);

    List<Auditoria> findByFechaEventoBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Auditoria> findByNombreUsuarioResponsableAndFechaEventoBetween(
            String nombreUsuario,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}
