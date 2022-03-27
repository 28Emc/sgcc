package com.sgcc.sgccapi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_lecturas")
@Getter
@Setter
@NoArgsConstructor
public class Lectura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lectura", columnDefinition = "int")
    private Long idLectura;

    // FK_tb_lecturas_tb_inquilinos: MUCHAS LECTURAS -> UN INQUILINO
    @ManyToOne
    @JoinColumn(name = "id_inquilino")
    private Inquilino inquilino;

    // FK_tb_lecturas_tb_recibos: MUCHAS LECTURAS -> UN RECIBO
    @ManyToOne
    @JoinColumn(name = "id_recibo")
    private Recibo recibo;

    @Column(name = "lectura_medidor_anterior", columnDefinition = "int")
    @NotNull(message = "La lectura del medidor anterior es requerida")
    private int lecturaMedidorAnterior;

    @Column(name = "lectura_medidor_actual", columnDefinition = "int")
    @NotNull(message = "La lectura del medidor actual es requerida")
    private int lecturaMedidorActual;

    @Column(name = "fecha_creacion", columnDefinition = "datetime")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_baja", columnDefinition = "datetime")
    private LocalDateTime fechaBaja;

    // hace referencia a "private Lectura lectura", situado en Consumo.java
    @OneToOne(mappedBy = "lectura")
    @JsonIgnore
    private Consumo consumo;

    public Lectura(Inquilino inquilino, Recibo recibo, int lecturaMedidorAnterior, int lecturaMedidorActual, LocalDateTime fechaCreacion) {
        this.inquilino = inquilino;
        this.recibo = recibo;
        this.lecturaMedidorAnterior = lecturaMedidorAnterior;
        this.lecturaMedidorActual = lecturaMedidorActual;
        this.fechaCreacion = fechaCreacion;
    }
}
