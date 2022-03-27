package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.TipoRecibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITipoReciboRepository extends JpaRepository<TipoRecibo, Long> {
    Optional<TipoRecibo> findByTipoRecibo(String tipoRecibo);
}
