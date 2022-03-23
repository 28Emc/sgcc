package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Lectura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ILecturaRepository extends JpaRepository<Lectura, Long> {
}
