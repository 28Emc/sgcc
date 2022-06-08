package com.sgcc.sgccapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarPasswordDTO {
    @NotNull(message = "El nombre de usuario es requerido")
    private String usuario;

    @NotNull(message = "Falta definir si el usuario es admin o no")
    @JsonProperty("is_admin")
    private boolean isAdmin;

    @NotNull(message = "La contraseña actual es requerida")
    @JsonProperty("current_password")
    private String currentPassword;

    @NotEmpty(message = "La nueva contraseña es requerida")
    @JsonProperty("new_password")
    private String newPassword;

    @NotNull(message = "La confirmación de la contraseña es requerida")
    @JsonProperty("confirm_new_password")
    private String confirmNewPassword;
}
