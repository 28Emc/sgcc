package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.entity.TipoRecibo;

import java.util.List;
import java.util.Optional;

public interface ITipoReciboService {
    List<TipoRecibo> getAllTiposRecibo();

    Optional<TipoRecibo> getTipoReciboByIdTipoRecibo(Long idTipoRecibo);

    Optional<TipoRecibo> getTipoReciboByTipoRecibo(String tipoRecibo);

    TipoRecibo createTipoRecibo(TipoRecibo tipoRecibo) throws Exception;

    TipoRecibo updateTipoRecibo(Long idTipoRecibo, TipoRecibo tipoRecibo) throws Exception;
}
