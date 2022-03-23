package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Consumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IConsumoRepository extends JpaRepository<Consumo, Long> {
}
