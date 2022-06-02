package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearReciboDTO {
    @NotNull(message = "El tipo de recibo es requerido")
    private Long idTipoRecibo;

    @NotBlank(message = "El mes del recibo es requerido")
    private String mesRecibo;

    @NotBlank(message = "La dirección del recibo es requerida")
    private String direccionRecibo;

    @NotNull(message = "El consumo unitario es requerido")
    private Double consumoUnitario;

    @NotNull(message = "El consumo total es requerido")
    private Integer consumoTotal;

    @NotNull(message = "El importe es requerido")
    private Double importe;
}

