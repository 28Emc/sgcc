package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.dto.ListaInquilinosDTO;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IInquilinoRepository extends JpaRepository<Inquilino, Long> {
    @Procedure("sp_ObtenerInquilinosDetalle")
    List<ListaInquilinosDTO> findAllInquilinosUsuarioPersona();

    Optional<Inquilino> findByPersona(Persona persona);
}
