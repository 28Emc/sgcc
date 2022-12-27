package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Medidor;
import com.sgcc.sgccapi.model.Recibo;
import com.sgcc.sgccapi.model.TipoRecibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IReciboRepository extends JpaRepository<Recibo, Long> {
    Optional<Recibo> findByTipoReciboAndMesReciboAndMedidor(TipoRecibo tipoRecibo, int mes,
                                                            Medidor medidor);
}
