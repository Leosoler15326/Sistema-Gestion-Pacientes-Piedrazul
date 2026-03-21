package com.SGPPiedrazul.service;

import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.FranjaHoraria;
import com.SGPPiedrazul.model.Profesional;
import com.SGPPiedrazul.model.enums.EstadoCita;
import com.SGPPiedrazul.repository.CitaRepository;
import com.SGPPiedrazul.repository.FranjaHorariaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisponibilidadService {

    private final CitaRepository citaRepository;
    private final FranjaHorariaRepository franjaHorariaRepository;

    public DisponibilidadService(CitaRepository citaRepository,
                                  FranjaHorariaRepository franjaHorariaRepository) {
        this.citaRepository = citaRepository;
        this.franjaHorariaRepository = franjaHorariaRepository;
    }

    // Retorna todos los slots disponibles para un profesional en una fecha dada
    public List<LocalDateTime> calcularSlotsDisponibles(Profesional profesional, LocalDate fecha) {
        List<FranjaHoraria> franjas = franjaHorariaRepository
                .findByProfesionalIdAndDiaSemana(profesional.getId(), fecha.getDayOfWeek());

        if (franjas.isEmpty()) return List.of();

        // Genera todos los slots posibles según las franjas y el intervalo
        List<LocalDateTime> todosLosSlots = new ArrayList<>();
        for (FranjaHoraria franja : franjas) {
            todosLosSlots.addAll(generarSlots(franja, profesional.getIntervaloMinutos(), fecha));
        }

        // Filtra los que ya están ocupados
        List<Cita> citasExistentes = citaRepository.findByProfesionalAndFechaHoraBetween(
                profesional,
                fecha.atStartOfDay(),
                fecha.atTime(LocalTime.MAX)
        );

        List<LocalDateTime> ocupados = citasExistentes.stream()
                .filter(c -> c.getEstado() != EstadoCita.CANCELADA)
                .map(Cita::getFechaHora)
                .collect(Collectors.toList());

        return todosLosSlots.stream()
                .filter(slot -> !ocupados.contains(slot))
                .collect(Collectors.toList());
    }

    // Verifica si un slot específico está disponible
    public boolean validarDisponibilidad(Profesional profesional, LocalDateTime fechaHora) {
        return !citaRepository.existsByProfesionalAndFechaHoraAndEstadoNot(
                profesional, fechaHora, EstadoCita.CANCELADA
        );
    }

    // Genera los slots de tiempo dentro de una franja horaria
    private List<LocalDateTime> generarSlots(FranjaHoraria franja, int intervaloMinutos, LocalDate fecha) {
        List<LocalDateTime> slots = new ArrayList<>();
        LocalTime cursor = franja.getHoraInicio();

        while (!cursor.plusMinutes(intervaloMinutos).isAfter(franja.getHoraFin())) {
            slots.add(LocalDateTime.of(fecha, cursor));
            cursor = cursor.plusMinutes(intervaloMinutos);
        }

        return slots;
    }
}
