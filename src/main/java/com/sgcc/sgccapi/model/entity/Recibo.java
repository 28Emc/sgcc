package com.sgcc.sgccapi.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_recibos")
@Getter
@Setter
@NoArgsConstructor
public class Recibo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recibo", columnDefinition = "int")
    private Long idRecibo;

    // FK_tb_recibos_tb_tipos_recibos: MUCHOS RECIBOS -> UN TIPO RECIBO
    @ManyToOne
    @JoinColumn(name = "id_tipo_recibo")
    private TipoRecibo tipoRecibo;

    @Column(name = "url_archivo", columnDefinition = "varchar(255)")
    @NotBlank(message = "El archivo es requerido")
    private String urlArchivo;

    @Column(name = "fecha_registro", columnDefinition = "datetime")
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_baja", columnDefinition = "datetime")
    private LocalDateTime fechaBaja;
}
