package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarReciboDTO {
    @NotNull(message = "El id recibo es requerido")
    private Long idRecibo;

    @NotNull(message = "El tipo de recibo es requerido")
    private Long idTipoRecibo;

    @NotNull(message = "La url del recibo es requerida")
    private String urlArchivo;

    @NotNull(message = "El mes del recibo es requerido")
    @Min(value = 1, message = "El mes del recibo debe ser igual o mayor a 1")
    @Max(value = 12, message = "El mes del recibo debe ser igual o menor a 12")
    private int mesRecibo;

    @NotNull(message = "La dirección del recibo es requerida")
    private String direccionRecibo;

    @NotNull(message = "El consumo unitario es requerido")
    private Double consumoUnitario;

    @NotNull(message = "El importe es requerido")
    private Double importe;
}

