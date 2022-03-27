package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Inquilino;
import com.sgcc.sgccapi.model.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IInquilinoRepository extends JpaRepository<Inquilino, Long> {
    Optional<Inquilino> findByPersona(Persona persona);
}
