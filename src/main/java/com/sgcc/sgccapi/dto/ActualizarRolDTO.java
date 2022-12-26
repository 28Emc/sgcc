package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarRolDTO {
    @NotNull(message = "El id rol es requerido")
    private Long idRol;

    @NotNull(message = "El nombre del rol es requerido")
    private String rol;

    private String descripcion;

    private String ruta;

    @NotNull(message = "Los componentes son requeridos")
    private List<ComponenteDTO> componentes;
}
