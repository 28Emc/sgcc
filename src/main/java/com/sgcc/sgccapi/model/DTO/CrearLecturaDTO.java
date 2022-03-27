package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearLecturaDTO {
    @NotNull(message = "El inquilino es requerido")
    private Long idInquilino;

    @NotNull(message = "El recibo es requerido")
    private Long idRecibo;

    @NotNull(message = "La lectura del medidor es requerida")
    private Integer lecturaMedidor;
}
