package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.enums.Especialidad;
import com.SGPPiedrazul.model.enums.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {

    List<Profesional> findByEstado(Estado estado);

    List<Profesional> findByEspecialidad(Especialidad especialidad);

    List<Profesional> findByEspecialidadAndEstado(Especialidad especialidad, Estado estado);
}
