package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoDTO {
    @NotNull(message = "El id es requerido")
    private Long id;

    @NotNull(message = "El estado es requerido")
    private String estado;
}
