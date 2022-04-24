package com.sgcc.sgccapi.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_consumos")
@Getter
@Setter
@NoArgsConstructor
public class Consumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consumo", columnDefinition = "int")
    private Long idConsumo;

    // FK_tb_consumos_tb_lecturas: UN CONSUMO -> UNA LECTURA
    @OneToOne
    @JoinColumn(name = "id_lectura")
    private Lectura lectura;

    @Column(name = "consumo_importe", columnDefinition = "decimal(18, 2)")
    @NotNull(message = "El consumo importe es requerido")
    private Double consumoImporte;

    @Column(name = "fecha_creacion", columnDefinition = "datetime")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_baja", columnDefinition = "datetime")
    private LocalDateTime fechaBaja;
}
