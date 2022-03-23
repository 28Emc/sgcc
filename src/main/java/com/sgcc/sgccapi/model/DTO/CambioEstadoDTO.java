package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoDTO {
    @NotNull(message = "El id es requerido")
    @Column(columnDefinition = "int")
    private Long id;

    @NotNull(message = "El estado es requerido")
    @Column(columnDefinition = "enum('A', 'B')")
    private String estado;
}
