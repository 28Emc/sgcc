package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Recibo;
import com.sgcc.sgccapi.model.TipoRecibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IReciboRepository extends JpaRepository<Recibo, Long> {
    Optional<Recibo> findByTipoReciboAndMesReciboAndDireccionRecibo(TipoRecibo tipoRecibo, String mes,
                                                                    String direccion);
}
