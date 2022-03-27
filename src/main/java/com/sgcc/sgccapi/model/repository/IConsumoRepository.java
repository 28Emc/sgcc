package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Consumo;
import com.sgcc.sgccapi.model.entity.Lectura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IConsumoRepository extends JpaRepository<Consumo, Long> {
    Optional<Consumo> findByLectura(Lectura lectura);
}
