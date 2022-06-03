package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Medidor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IMedidorRepository extends JpaRepository<Medidor, Long> {
    Optional<Medidor> findByCodigoMedidor(String codigoMedidor);
}
