package com.sgcc.sgccapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarInquilinoDTO {
    @NotNull(message = "El tipo de documento es requerido")
    @JsonProperty("tipo_documento")
    private String tipoDocumento;

    @NotNull(message = "El nro. de documento es requerido")
    @JsonProperty("nro_documento")
    private String nroDocumento;

    @NotNull(message = "El género es requerido")
    private String genero;

    @NotNull(message = "Los nombres son requeridos")
    private String nombres;

    @NotNull(message = "El apellido paterno es requerido")
    @JsonProperty("apellido_paterno")
    private String apellidoPaterno;

    @NotNull(message = "El apellido materno es requerido")
    @JsonProperty("apellido_materno")
    private String apellidoMaterno;

    @NotNull(message = "La dirección es requerida")
    private String direccion;

    @NotNull(message = "El nro. de teléfono es requerido")
    private String telefono;

    @NotNull(message = "El correo es requerido")
    private String email;

    @NotNull(message = "El id usuario es requerido")
    @JsonProperty("id_usuario")
    private Long idUsuario;

    @NotNull(message = "El nombre de usuario es requerido")
    private String usuario;

    @NotNull(message = "El estado es requerido")
    private String estado;

    // @JsonProperty("fecha_inicio_contrato")
    // private LocalDateTime fechaInicioContrato;

    // @JsonProperty("fecha_fin_contrato")
    // private LocalDateTime fechaFinContrato;
}
