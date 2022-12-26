package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearRolDTO {
    @NotNull(message = "El nombre del rol es requerido")
    private String rol;

    private String descripcion;

    @NotNull(message = "La ruta es requerida")
    private String ruta;

    @NotNull(message = "Los componentes son requeridos")
    private List<ComponenteDTO> componentes;
}
