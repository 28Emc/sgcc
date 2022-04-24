package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.model.TipoRecibo;

import java.util.List;
import java.util.Optional;

public interface ITipoReciboService {
    List<TipoRecibo> getAllTiposRecibo();

    Optional<TipoRecibo> getTipoReciboByIdTipoRecibo(Long idTipoRecibo);

    Optional<TipoRecibo> getTipoReciboByTipoRecibo(String tipoRecibo);

    void createTipoRecibo(TipoRecibo tipoRecibo) throws Exception;

    void updateTipoRecibo(Long idTipoRecibo, TipoRecibo tipoRecibo) throws Exception;
}
