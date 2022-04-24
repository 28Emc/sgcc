package com.sgcc.sgccapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_personas")
@Getter
@Setter
@NoArgsConstructor
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona", columnDefinition = "int")
    private Long idPersona;

    @Column(name = "tipo_documento", columnDefinition = "varchar(100)")
    @NotBlank(message = "El tipo de documento es requerido")
    private String tipoDocumento;

    @Column(name = "nro_documento", columnDefinition = "varchar(11)")
    @NotBlank(message = "El nro. de documento es requerido")
    private String nroDocumento;

    @Column(name = "genero", columnDefinition = "enum('M', 'F', 'N')")
    @NotBlank(message = "El género es requerido")
    private String genero;

    @Column(name = "nombres", columnDefinition = "varchar(100)")
    @NotBlank(message = "Los nombres son requeridos")
    private String nombres;

    @Column(name = "apellido_paterno", columnDefinition = "varchar(255)")
    @NotBlank(message = "El apellido paterno es requerido")
    private String apellidoPaterno;

    @Column(name = "apellido_materno", columnDefinition = "varchar(255)")
    @NotBlank(message = "El apellido materno es requerido")
    private String apellidoMaterno;

    @Column(name = "direccion", columnDefinition = "varchar(255)")
    @NotBlank(message = "La dirección es requerida")
    private String direccion;

    @Column(name = "telefono", columnDefinition = "varchar(20)")
    @NotBlank(message = "El teléfono es requerido")
    private String telefono;

    @Column(name = "email", columnDefinition = "varchar(100)")
    @NotBlank(message = "El correo es requerido")
    private String email;

    // hace referencia a "private Persona persona", situado en Usuario.java
    @OneToOne(mappedBy = "persona")
    @JsonIgnore
    private Usuario usuario;

    // hace referencia a "private Persona persona", situado en Inquilino.java
    @OneToOne(mappedBy = "persona")
    @JsonIgnore
    private Inquilino inquilino;

    public Persona(String tipoDocumento, String nroDocumento, String genero, String nombres, String apellidoPaterno,
                   String apellidoMaterno, String direccion, String telefono, String email) {
        this.tipoDocumento = tipoDocumento;
        this.nroDocumento = nroDocumento;
        this.genero = genero;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}
