package com.SGPPiedrazul.service.export;

import com.SGPPiedrazul.dto.CitaDTO;

import java.util.List;

/**
 * Strategy (GoF): formato de exportación de listas de citas intercambiable
 * (CSV hoy; se puede añadir XLSX u otro sin modificar el servicio de dominio).
 */
public interface CitaListExporter {

    byte[] export(List<CitaDTO.Response> citas);
}
