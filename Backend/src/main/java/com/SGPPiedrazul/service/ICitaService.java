package com.SGPPiedrazul.service;

import com.SGPPiedrazul.dto.CitaDTO;
import com.SGPPiedrazul.model.Cita;
import com.SGPPiedrazul.model.Usuario;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrato del caso de uso de citas (DIP): controladores dependen de la abstracción,
 * no de la implementación concreta {@link CitaService}.
 */
public interface ICitaService {

    CitaDTO.Response agendar(CitaDTO.AgendarRequest dto, Usuario creadoPor);

    CitaDTO.Response agendarDesdeContacto(CitaDTO.AgendarContactoRequest dto, Usuario creadoPor);

    CitaDTO.Response reagendar(Long citaId, CitaDTO.ReagendarRequest dto, Usuario responsable);

    void cancelar(Long citaId, CitaDTO.CancelarRequest dto, Usuario responsable);

    CitaDTO.Response cambiarEstado(Long citaId, CitaDTO.CambiarEstadoRequest dto, Usuario responsable);

    CitaDTO.Response buscarPorId(Long id);

    CitaDTO.Response obtenerResumenPorId(Long id);

    List<CitaDTO.SlotResponse> obtenerSlots(Long profesionalId, LocalDate fecha);

    List<CitaDTO.Response> listarPorProfesionalYRangoFechas(
            Long profesionalId,
            LocalDate fechaInicio,
            LocalDate fechaFin);

    List<CitaDTO.Response> listarPorPaciente(Long pacienteId);

    List<CitaDTO.Response> listarMisCitasComoPaciente();

    byte[] exportarCsvProfesionalFecha(Long profesionalId, LocalDate fecha);

    Cita buscarEntidadPorId(Long id);
}
