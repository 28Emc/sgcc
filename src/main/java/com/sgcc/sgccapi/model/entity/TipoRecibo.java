package com.sgcc.sgccapi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "tb_tipos_recibo")
@Getter
@Setter
@NoArgsConstructor
public class TipoRecibo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_recibo", columnDefinition = "int")
    private Long idTipoRecibo;

    @Column(name = "tipo_recibo", columnDefinition = "varchar(30)")
    @NotBlank(message = "El tipo de recibo es requerido")
    private String tipoRecibo;

    @Column(name = "descripcion", columnDefinition = "text")
    private String descripcion;

    // hace referencia a "private TipoRecibo tipoRecibo", situado en Recibo.java
    @OneToMany(mappedBy = "tipoRecibo")
    @JsonIgnore
    private List<Recibo> recibos;
}
