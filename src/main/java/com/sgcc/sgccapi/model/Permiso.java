package com.sgcc.sgccapi.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "tb_permisos")
@Getter
@Setter
@NoArgsConstructor
public class Permiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso", columnDefinition = "int")
    private Long idPermiso;

    // FK_tb_permisos_tb_roles: MUCHOS PERMISOS -> UN ROL
    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    // FK_tb_permisos_tb_componentes: MUCHOS PERMISOS -> UN COMPONENTE
    @ManyToOne
    @JoinColumn(name = "id_componente")
    private Componente componente;

    @Column(name = "estado", columnDefinition = "enum('A', 'B')")
    private String estado;

    public Permiso(Rol rol, Componente componente, String estado) {
        this.rol = rol;
        this.componente = componente;
        this.estado = estado;
    }
}
