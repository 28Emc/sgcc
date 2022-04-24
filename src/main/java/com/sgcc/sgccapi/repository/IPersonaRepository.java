package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByNroDocumento(String nroDocumento);
}
