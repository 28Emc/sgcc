package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearPermisoDTO {
    @NotNull(message = "El rol es requerido")
    private Long idRol;

    @NotNull(message = "El componente es requerido")
    private Long idComponente;

    @NotNull(message = "El estado es requerido")
    private String estado;
}
