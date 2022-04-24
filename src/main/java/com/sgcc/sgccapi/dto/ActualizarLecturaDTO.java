package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarLecturaDTO {
    @NotNull(message = "El id lectura es requerido")
    private Long idLectura;

    @NotNull(message = "El id consumo es requerido")
    private Long idConsumo;

    @NotNull(message = "El inquilino es requerido")
    private Long idInquilino;

    @NotNull(message = "El recibo es requerido")
    private Long idRecibo;

    @NotNull(message = "La lectura anterior del medidor es requerida")
    private Integer lecturaMedidorAnterior;

    @NotNull(message = "La lectura actual del medidor es requerida")
    private Integer lecturaMedidorActual;
}
