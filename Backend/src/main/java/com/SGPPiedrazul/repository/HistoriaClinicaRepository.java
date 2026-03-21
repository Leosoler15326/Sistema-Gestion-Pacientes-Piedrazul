package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {

    Optional<HistoriaClinica> findByCitaId(Long citaId);

    List<HistoriaClinica> findByProfesionalId(Long profesionalId);

    List<HistoriaClinica> findByCitaPacienteId(Long pacienteId);

    boolean existsByCitaId(Long citaId);
}
