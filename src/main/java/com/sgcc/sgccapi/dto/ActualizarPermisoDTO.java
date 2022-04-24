package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarPermisoDTO {
    @NotNull(message = "El id permiso es requerido")
    private Long idPermiso;

    @NotNull(message = "El rol es requerido")
    private Long idRol;

    @NotNull(message = "El componente es requerido")
    private Long idComponente;

    @NotNull(message = "El estado es requerido")
    private String estado;
}
