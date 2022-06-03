package com.sgcc.sgccapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_medidores")
@Getter
@Setter
@NoArgsConstructor
public class Medidor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medidor", columnDefinition = "int")
    private Long idMedidor;

    @Column(name = "codigo_medidor", columnDefinition = "varchar(255)")
    @NotBlank(message = "El código del medidor es requerido")
    private String codigoMedidor;

    @Column(name = "direccion_medidor", columnDefinition = "varchar(255)")
    @NotBlank(message = "La dirección del medidor es requerida")
    private String direccionMedidor;

    @Column(name = "fecha_registro", columnDefinition = "datetime")
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_actualizacion", columnDefinition = "datetime")
    private LocalDateTime fechaActualizacion;

    // hace referencia a "private Medidor medidor", situado en Medidor.java
    @OneToMany(mappedBy = "medidor")
    @JsonIgnore
    private List<Recibo> recibos;

    public Medidor(String codigoMedidor, String direccionMedidor, LocalDateTime fechaRegistro,
                   LocalDateTime fechaActualizacion) {
        this.codigoMedidor = codigoMedidor;
        this.direccionMedidor = direccionMedidor;
        this.fechaRegistro = fechaRegistro;
        this.fechaActualizacion = fechaActualizacion;
    }
}
