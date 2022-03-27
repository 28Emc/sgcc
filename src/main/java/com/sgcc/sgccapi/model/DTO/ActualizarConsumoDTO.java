package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarConsumoDTO {
    @NotNull(message = "El consumo es requerido")
    private Long idConsumo;

    @NotNull(message = "La lectura es requerida")
    private Long idLectura;

    @NotNull(message = "El consumo importe es requerido")
    private Double consumoImporte;
}
