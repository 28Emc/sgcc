package com.sgcc.sgccapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
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

    // FK_tb_recibos_tb_medidores: MUCHOS RECIBOS -> UN MEDIDOR
    @ManyToOne
    @JoinColumn(name = "id_medidor")
    private Medidor medidor;

    @Column(name = "url_archivo", columnDefinition = "varchar(255)")
    private String urlArchivo;

    @Column(name = "mes_recibo", columnDefinition = "int")
    @NotNull(message = "El mes del recibo es requerido")
    @Min(value = 1, message = "El mes del recibo debe ser igual o mayor a 1")
    @Max(value = 12, message = "El mes del recibo debe ser igual o menor a 12")
    private int mesRecibo;

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

    public Recibo(TipoRecibo tipoRecibo, Medidor medidor, String urlArchivo, int mesRecibo, Double consumoUnitario,
                  Integer consumoTotal, Double importe, LocalDateTime fechaRegistro) {
        this.tipoRecibo = tipoRecibo;
        this.medidor = medidor;
        this.urlArchivo = urlArchivo;
        this.mesRecibo = mesRecibo;
        this.consumoUnitario = consumoUnitario;
        this.consumoTotal = consumoTotal;
        this.importe = importe;
        this.fechaRegistro = fechaRegistro;
    }
}
