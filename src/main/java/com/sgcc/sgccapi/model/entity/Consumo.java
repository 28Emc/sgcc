package com.sgcc.sgccapi.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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

    @Column(name = "consumo_unitario", columnDefinition = "decimal(18, 2)")
    @NotBlank(message = "El consumo unitario es requerido")
    private Double consumoUnitario;

    @Column(name = "consumo_importe", columnDefinition = "decimal(18, 2)")
    @NotBlank(message = "El consumo importe es requerido")
    private Double consumoImporte;
}
