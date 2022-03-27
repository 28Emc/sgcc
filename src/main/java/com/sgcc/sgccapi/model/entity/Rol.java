package com.sgcc.sgccapi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "tb_roles")
@Getter
@Setter
@NoArgsConstructor
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol", columnDefinition = "int")
    private Long idRol;

    @Column(name = "rol", columnDefinition = "varchar(10)")
    private String rol;

    @Column(name = "descripcion", columnDefinition = "text")
    private String descripcion;

    @Column(name = "ruta", columnDefinition = "varchar(255)")
    private String ruta;

    // hace referencia a "private Rol rol", situado en Rol.java
    @OneToOne(mappedBy = "rol")
    @JsonIgnore
    private Usuario usuario;

    // hace referencia a "private Rol rol", situado en Permiso.java
    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<Permiso> permisos;

    public Rol(String rol, String descripcion, String ruta) {
        this.rol = rol;
        this.descripcion = descripcion;
        this.ruta = ruta;
    }
}
