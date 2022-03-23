package com.sgcc.sgccapi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;

@Entity
@Table(name = "tb_componentes")
@Getter
@Setter
@NoArgsConstructor
public class Componente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_componente", columnDefinition = "int")
    private Long idComponente;

    @Column(name = "id_componente_padre", columnDefinition = "int")
    @NotNull(message = "El componente padre es requerido")
    private Long idComponentePadre;

    @Column(name = "componente", columnDefinition = "varchar(100)")
    @NotBlank(message = "El componente es requerido")
    private String componente;

    @Column(name = "descripcion", columnDefinition = "text")
    private String descripcion;

    @Column(name = "icono", columnDefinition = "varchar(60)")
    @NotBlank(message = "El icono es requerido")
    private String icono;

    @Column(name = "ruta", columnDefinition = "varchar(255)")
    @NotBlank(message = "La ruta es requerida")
    private String ruta;

    @Column(name = "orden", columnDefinition = "int")
    @NotNull(message = "El orden es requerido")
    @Positive(message = "El orden debe ser mayor a 0")
    private int orden;

    @Column(name = "estado", columnDefinition = "enum('A', 'B')")
    @NotNull(message = "El estado es requerido")
    private String estado;

    @OneToMany(mappedBy = "componente")
    @JsonIgnore
    private List<Permiso> permisos;
}
