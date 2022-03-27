package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Inquilino;
import com.sgcc.sgccapi.model.entity.Lectura;
import com.sgcc.sgccapi.model.entity.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ILecturaRepository extends JpaRepository<Lectura, Long> {
    List<Lectura> findByInquilino(Inquilino inquilino);

    List<Lectura> findByRecibo(Recibo recibo);

    List<Lectura> findByInquilinoAndRecibo(Inquilino inquilino, Recibo recibo);
}
