package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.enums.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    // Citas de un profesional en un rango de fechas
    List<Cita> findByProfesionalAndFechaHoraBetween(
            Profesional profesional,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    // Todas las citas en un rango de fechas (para exportación multi-profesional)
    List<Cita> findByFechaHoraBetweenOrderByProfesionalNombresAscFechaHoraAsc(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    // Verifica si ya existe una cita en ese slot exacto
    boolean existsByProfesionalAndFechaHoraAndEstadoNot(
            Profesional profesional,
            LocalDateTime fechaHora,
            EstadoCita estado
    );

    // Citas de un paciente
    List<Cita> findByPacienteId(Long pacienteId);

    // Citas por estado
    List<Cita> findByEstado(EstadoCita estado);

    // Citas de un profesional por estado
    List<Cita> findByProfesionalAndEstado(Profesional profesional, EstadoCita estado);

    // Conteo por profesional y mes para reportes
    @Query("SELECT COUNT(c) FROM Cita c WHERE c.profesional.id = :profId " +
           "AND MONTH(c.fechaHora) = :mes AND YEAR(c.fechaHora) = :anio")
    Long countByProfesionalAndMes(
            @Param("profId") Long profId,
            @Param("mes") int mes,
            @Param("anio") int anio
    );

    // Conteo por especialidad y mes para reportes
    @Query("SELECT COUNT(c) FROM Cita c WHERE c.profesional.especialidad = :especialidad " +
           "AND MONTH(c.fechaHora) = :mes AND YEAR(c.fechaHora) = :anio")
    Long countByEspecialidadAndMes(
            @Param("especialidad") String especialidad,
            @Param("mes") int mes,
            @Param("anio") int anio
    );
}
