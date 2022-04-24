package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Lectura;
import com.sgcc.sgccapi.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ILecturaRepository extends JpaRepository<Lectura, Long> {
    List<Lectura> findByInquilino(Inquilino inquilino);

    List<Lectura> findByRecibo(Recibo recibo);

    List<Lectura> findByInquilinoAndRecibo(Inquilino inquilino, Recibo recibo);
}
