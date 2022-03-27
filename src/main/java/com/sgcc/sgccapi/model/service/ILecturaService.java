package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarLecturaDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearLecturaDTO;
import com.sgcc.sgccapi.model.entity.Consumo;
import com.sgcc.sgccapi.model.entity.Lectura;

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

    Lectura createLectura(CrearLecturaDTO crearLecturaDTO) throws Exception;

    Lectura updateLectura(Long idLectura, ActualizarLecturaDTO actualizarLecturaDTO) throws Exception;

    void updateEstadoLectura(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
