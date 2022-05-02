package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.dto.LecturasDTO;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Lectura;
import com.sgcc.sgccapi.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ILecturaRepository extends JpaRepository<Lectura, Long> {
    @Query(nativeQuery = true, value = "CALL sp_ObtenerLecturasConDetalle()")
    List<LecturasDTO> findAllWithDetails();

    List<Lectura> findByInquilino(Inquilino inquilino);

    List<Lectura> findByRecibo(Recibo recibo);

    @Query(nativeQuery = true, value = "CALL sp_ObtenerLecturaPorIdInquilinoYMesLectura(:idInquilino, :mesLectura)")
    Optional<LecturasDTO> findByIdInquilinoAndMesLectura(Long idInquilino, String mesLectura);
}
