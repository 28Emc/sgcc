package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.dto.LecturasDTO;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Lectura;
import com.sgcc.sgccapi.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ILecturaRepository extends JpaRepository<Lectura, Long> {
    @Procedure("sp_ObtenerLecturasConDetalle")
    List<LecturasDTO> findAllWithDetails();

    List<Lectura> findByInquilino(Inquilino inquilino);

    List<Lectura> findByRecibo(Recibo recibo);

    @Procedure("sp_ObtenerLecturaPorIdInquilinoYMesLectura")
    Optional<LecturasDTO> spObtenerLecturaPorIdInquilinoYMesLectura(Long idInquilino, int mesLectura);
}
