package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarRolDTO {
    @NotNull(message = "El id rol es requerido")
    private Long idRol;

    @NotNull(message = "El nombre del rol es requerido")
    private String rol;

    private String descripcion;

    @NotNull(message = "La ruta es requerida")
    private String ruta;
}
