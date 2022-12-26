package com.sgcc.sgccapi.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", columnDefinition = "int")
    private Long idUsuario;

    // FK_tb_usuarios_tb_roles: MUCHOS USUARIOS -> UN ROL
    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    // FK_tb_usuarios_tb_personas: UN USUARIO -> UNA PERSONA
    @OneToOne
    @JoinColumn(name = "id_persona")
    private Persona persona;

    @Column(name = "usuario", columnDefinition = "varchar(60)")
    @NotBlank(message = "El nombre de usuario es requerido")
    private String usuario;

    @Column(name = "password", columnDefinition = "varchar(255)")
    @NotBlank(message = "La contraseña es requerida")
    private String password;

    // @Column(name = "foto", columnDefinition = "varchar(255)")
    // private String foto;

    @Column(name = "estado", columnDefinition = "enum('A', 'B')")
    private String estado;

    @Column(name = "fecha_creacion", columnDefinition = "datetime")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_baja", columnDefinition = "datetime")
    private LocalDateTime fechaBaja;

    @Column(name = "is_activo", columnDefinition = "bit(1)")
    private Boolean isActivo;

    public Usuario(Rol rol, Persona persona, String usuario, String password, String estado,
                   LocalDateTime fechaCreacion, LocalDateTime fechaActualizacion,
                   LocalDateTime fechaBaja, Boolean isActivo) {
        this.rol = rol;
        this.persona = persona;
        this.usuario = usuario;
        this.password = password;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
        this.fechaBaja = fechaBaja;
        this.isActivo = isActivo;
    }
}
