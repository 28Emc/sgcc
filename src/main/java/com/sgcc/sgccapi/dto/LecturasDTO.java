package com.sgcc.sgccapi.dto;

import java.time.LocalDateTime;

public interface LecturasDTO {
    Long getIdLectura();

    Long getIdInquilino();

    Long getIdRecibo();

    Long getIdConsumo();

    String getNombreCompletoInquilino();

    String getMesRecibo();

    String getRecibo();

    Integer getLecturaMedidorAnterior();

    Integer getLecturaMedidorActual();

    Integer getConsumoMedidor();

    Double getConsumoUnitario();

    Double getImporte();

    LocalDateTime getFechaRegistro();

    LocalDateTime getFechaActualizacion();
}
