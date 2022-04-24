package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarLecturaDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearLecturaDTO;
import com.sgcc.sgccapi.model.Consumo;
import com.sgcc.sgccapi.model.Lectura;

import java.util.List;
import java.util.Optional;

public interface ILecturaService {
    List<Lectura> getAllLecturas();

    List<Lectura> getAllLecturasByIdInquilino(Long idInquilino) throws Exception;

    List<Lectura> getAllLecturasByIdRecibo(Long idRecibo) throws Exception;

    Optional<Lectura> getLecturaByIdLectura(Long idLectura);

    List<Lectura> getAllLecturasByIdInquilinoAndIdRecibo(Long idInquilino, Long idRecibo) throws Exception;

    List<Consumo> getAllConsumos();

    Optional<Consumo> getConsumoByIdConsumo(Long idConsumo);

    Optional<Consumo> getConsumoByIdLectura(Long idLectura) throws Exception;

    void createLectura(CrearLecturaDTO crearLecturaDTO) throws Exception;

    void updateLectura(Long idLectura, ActualizarLecturaDTO actualizarLecturaDTO) throws Exception;

    void updateEstadoLectura(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
