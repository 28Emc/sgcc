package com.sgcc.sgccapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

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
    private String urlArchivo;

    @Column(name = "mes_recibo", columnDefinition = "varchar(60)")
    @NotBlank(message = "El mes del recibo es requerido")
    private String mesRecibo;

    @Column(name = "direccion_recibo", columnDefinition = "varchar(255)")
    @NotBlank(message = "La dirección del recibo es requerida")
    private String direccionRecibo;

    @Column(name = "consumo_unitario", columnDefinition = "decimal(18, 2)")
    @NotNull(message = "El consumo unitario es requerido")
    private Double consumoUnitario;

    @Column(name = "consumo_total", columnDefinition = "int")
    @NotNull(message = "El consumo total es requerido")
    private Integer consumoTotal;

    @Column(name = "importe", columnDefinition = "decimal(18, 2)")
    @NotNull(message = "El importe es requerido")
    private Double importe;

    @Column(name = "fecha_registro", columnDefinition = "datetime")
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    // hace referencia a "private Recibo recibo", situado en Lectura.java
    @OneToMany(mappedBy = "recibo")
    @JsonIgnore
    private List<Lectura> lecturas;

    public Recibo(TipoRecibo tipoRecibo, String urlArchivo, String mesRecibo, Double consumoUnitario,
                  Integer consumoTotal, Double importe, String direccionRecibo, LocalDateTime fechaRegistro) {
        this.tipoRecibo = tipoRecibo;
        this.urlArchivo = urlArchivo;
        this.mesRecibo = mesRecibo;
        this.consumoUnitario = consumoUnitario;
        this.consumoTotal = consumoTotal;
        this.importe = importe;
        this.direccionRecibo = direccionRecibo;
        this.fechaRegistro = fechaRegistro;
    }
}
