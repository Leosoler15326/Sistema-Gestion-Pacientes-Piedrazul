package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.HistorialCita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialCitaRepository extends JpaRepository<HistorialCita, Long> {

    List<HistorialCita> findByCitaIdOrderByFechaCambioDesc(Long citaId);
}
