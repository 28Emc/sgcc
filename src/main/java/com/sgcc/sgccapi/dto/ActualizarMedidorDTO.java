package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarMedidorDTO {

    @NotNull(message = "El id medidor es requerido")
    private Long idMedidor;

    @NotBlank(message = "El código del medidor es requerido")
    private String codigoMedidor;

    @NotBlank(message = "La dirección del medidor es requerida")
    private String direccionMedidor;
}
