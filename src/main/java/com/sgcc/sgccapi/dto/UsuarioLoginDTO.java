package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioLoginDTO {
    public String usuario;
    public String foto;
    public PersonaDTO persona;
}
