package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PersonaDTO {
    public String nombres;
    public String apellido_paterno;
    public String apellido_materno;
    public String nro_documento;
    public String genero;
    public String direccion;
    public String telefono;
    public String email;
}
