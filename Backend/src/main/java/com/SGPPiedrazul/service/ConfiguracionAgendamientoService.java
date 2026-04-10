package com.SGPPiedrazul.service;

import com.SGPPiedrazul.model.ConfiguracionAgendamiento;
import com.SGPPiedrazul.repository.ConfiguracionAgendamientoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracionAgendamientoService {

    private final ConfiguracionAgendamientoRepository repository;

    public ConfiguracionAgendamientoService(ConfiguracionAgendamientoRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    @Transactional
    public void inicializarPorDefecto() {
        if (repository.findById(ConfiguracionAgendamiento.SINGLETON_ID).isEmpty()) {
            ConfiguracionAgendamiento c = new ConfiguracionAgendamiento();
            c.setId(ConfiguracionAgendamiento.SINGLETON_ID);
            c.setVentanaSemanasAgendar(8);
            repository.save(c);
        }
    }

    @Transactional(readOnly = true)
    public int getVentanaSemanasAgendar() {
        return repository.findById(ConfiguracionAgendamiento.SINGLETON_ID)
                .map(ConfiguracionAgendamiento::getVentanaSemanasAgendar)
                .orElse(8);
    }

    @Transactional
    public int actualizarVentanaSemanas(int semanas, String responsable) {
        if (semanas < 1 || semanas > 52) {
            throw new IllegalArgumentException("La ventana debe estar entre 1 y 52 semanas.");
        }
        ConfiguracionAgendamiento c = repository.findById(ConfiguracionAgendamiento.SINGLETON_ID)
                .orElseGet(() -> {
                    ConfiguracionAgendamiento n = new ConfiguracionAgendamiento();
                    n.setId(ConfiguracionAgendamiento.SINGLETON_ID);
                    return n;
                });
        c.setVentanaSemanasAgendar(semanas);
        repository.save(c);
        return semanas;
    }
}
