package com.sgcc.sgccapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioLoginDTO {
    public Long id_usuario;
    public Long id_inquilino;
    public String usuario;
    public String foto;
    public PersonaDTO persona;
    public String estado;
}
