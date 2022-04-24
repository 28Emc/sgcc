package com.sgcc.sgccapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_inquilinos")
@Getter
@Setter
@NoArgsConstructor
public class Inquilino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inquilino", columnDefinition = "int")
    private Long idInquilino;

    // FK_tb_inquilinos_tb_personas: UN INQUILINO -> UNA PERSONA
    @OneToOne
    @JoinColumn(name = "id_persona")
    private Persona persona;

    @Column(name = "fecha_inicio_contrato", columnDefinition = "datetime")
    private LocalDateTime fechaInicioContrato;

    @Column(name = "fecha_fin_contrato", columnDefinition = "datetime")
    private LocalDateTime fechaFinContrato;

    // hace referencia a "private Inquilino inquilino", situado en Lectura.java
    @OneToMany(mappedBy = "inquilino")
    @JsonIgnore
    private List<Lectura> lecturas;

    public Inquilino(Persona persona, LocalDateTime fechaInicioContrato) {
        this.persona = persona;
        this.fechaInicioContrato = fechaInicioContrato;
    }
}
