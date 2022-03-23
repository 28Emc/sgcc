package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IReciboRepository extends JpaRepository<Recibo, Long> {
}
