package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisoComponenteItem {
    private Long idPermiso;
    private Long idComponente;
    private Long idComponentePadre;
    private String componente;
    private String icono;
    private String ruta;
    private String orden;
    private String estado;
}
