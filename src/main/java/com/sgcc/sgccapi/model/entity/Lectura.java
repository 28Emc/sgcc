package com.sgcc.sgccapi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
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

    @Column(name = "tipo_recibo", columnDefinition = "varchar(30)")
    @NotBlank(message = "El tipo de recibo es requerido")
    private String tipoRecibo;

    @Column(name = "lectura_medidor", columnDefinition = "varchar(30)")
    @NotBlank(message = "La lectura del medidor es requerida")
    private String lecturaMedidor;

    @Column(name = "fecha_creacion", columnDefinition = "datetime")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_baja", columnDefinition = "datetime")
    private LocalDateTime fechaBaja;

    @OneToOne(mappedBy = "lectura")
    @JsonIgnore
    private Consumo consumo;
}
