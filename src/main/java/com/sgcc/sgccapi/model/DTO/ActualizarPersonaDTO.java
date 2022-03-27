package com.sgcc.sgccapi.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarPersonaDTO {
    @NotNull(message = "El tipo de documento es requerido")
    private String tipoDocumento;

    @NotNull(message = "El nro. de documento es requerido")
    private String nroDocumento;

    @NotNull(message = "El género es requerido")
    private String genero;

    @NotNull(message = "Los nombres son requeridos")
    private String nombres;

    @NotNull(message = "El apellido paterno es requerido")
    private String apellidoPaterno;

    @NotNull(message = "El apellido materno es requerido")
    private String apellidoMaterno;

    @NotNull(message = "La dirección es requerida")
    private String direccion;

    @NotNull(message = "El nro. de teléfono es requerido")
    private String telefono;

    @NotNull(message = "El correo es requerido")
    private String email;

    @NotNull(message = "El rol es requerido")
    private Long idRol;

    @NotNull(message = "El id usuario es requerido")
    private Long idUsuario;

    @NotNull(message = "El nombre de usuario es requerido")
    private String usuario;

    @NotNull(message = "El estado es requerido")
    private String estado;
}
