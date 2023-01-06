package com.sgcc.sgccapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    public String message;
    public LoginDetails details;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginDetails {
        private String ruta;
        private String token;
        @JsonProperty("refresh_token")
        private String refreshToken;
        private LoginUser user;
        private List<LoginPermisos> permisos;
        private LoginSesion sesion;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginUser {
        private String usuario;
        private String password;

        private String foto;
        private LoginPersona persona;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginPersona {
        private String nombre;
        @JsonProperty("apellido_paterno")
        private String apellidoPaterno;
        @JsonProperty("apellido_materno")
        private String apellidoMaterno;
        @JsonProperty("nro_documento")
        private String nroDocumento;
        private String genero;
        private String direccion;
        private String telefono;
        private String email;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginPermisos {
        @JsonProperty("id_componente")
        private Long idComponente;
        @JsonProperty("id_componente_padre")
        private Long idComponentePadre;
        @JsonProperty("id_permiso")
        private Long idPermiso;
        private String componente;
        private String icono;
        private String ruta;
        private int orden;
        private String estado;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginSesion {
        @JsonProperty("conectado")
        private String estado;
    }
}
