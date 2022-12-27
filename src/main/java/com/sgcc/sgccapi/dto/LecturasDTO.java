package com.sgcc.sgccapi.dto;

import java.time.LocalDateTime;

public interface LecturasDTO {
    Long getIdLectura();

    Long getIdInquilino();

    Long getIdRecibo();

    Long getIdConsumo();

    String getNombreCompletoInquilino();

    int getMesRecibo();

    String getRecibo();

    int getLecturaMedidorAnterior();

    int getLecturaMedidorActual();

    int getConsumoMedidor();

    Double getConsumoUnitario();

    Double getImporte();

    LocalDateTime getFechaRegistro();

    LocalDateTime getFechaActualizacion();
}
