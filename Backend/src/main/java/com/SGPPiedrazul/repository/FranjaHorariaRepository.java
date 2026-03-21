package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.FranjaHoraria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface FranjaHorariaRepository extends JpaRepository<FranjaHoraria, Long> {

    List<FranjaHoraria> findByProfesionalId(Long profesionalId);

    List<FranjaHoraria> findByProfesionalIdAndDiaSemana(Long profesionalId, DayOfWeek diaSemana);

    void deleteByProfesionalId(Long profesionalId);
}
