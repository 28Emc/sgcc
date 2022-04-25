package com.sgcc.sgccapi.dto;

import java.time.LocalDateTime;

public interface ListaInquilinosDTO {
    Long getIdInquilino();

    LocalDateTime getFechaInicioContrato();

    LocalDateTime getFechaFinContrato();

    Long getIdUsuario();

    String getUsuario();

    String getPassword();

    String getEstado();

    LocalDateTime getFechaCreacion();

    LocalDateTime getFechaActualizacion();

    LocalDateTime getFechaBaja();

    boolean getIsActivo();

    Long getIdPersona();

    String getTipoDocumento();

    String getNroDocumento();

    String getGenero();

    String getNombres();

    String getApellidoPaterno();

    String getApellidoMaterno();

    String getDireccion();

    String getTelefono();

    String getEmail();

    Long getIdRol();

    String getRol();

    String getDescripcion();

    String getRuta();
}
