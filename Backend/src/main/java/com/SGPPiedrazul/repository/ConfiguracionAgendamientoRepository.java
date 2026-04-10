package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.ConfiguracionAgendamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionAgendamientoRepository
        extends JpaRepository<ConfiguracionAgendamiento, Long> {
}
