package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisosComponentesDTO {
    @NotNull(message = "El id del rol es requerido")
    @Column(name = "id_rol")
    private Long idRol;

    @NotNull(message = "Los permisos son requeridos")
    private List<PermisoComponenteItem> permisos;
}
