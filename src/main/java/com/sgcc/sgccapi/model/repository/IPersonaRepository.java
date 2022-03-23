package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonaRepository extends JpaRepository<Persona, Long> {
}
