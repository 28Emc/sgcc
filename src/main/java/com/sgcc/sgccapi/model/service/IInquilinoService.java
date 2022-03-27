package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarInquilinoDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearInquilinoDTO;
import com.sgcc.sgccapi.model.entity.Inquilino;

import java.util.List;
import java.util.Optional;

public interface IInquilinoService {
    // TODO: SP_LISTAR_INQUILINOS_DETALLE
    List<Inquilino> getAllInquilinos();

    // TODO: SP_OBTENER_INQUILINO_POR_ID_DETALLE
    Optional<Inquilino> getInquilinoByIdInquilino(Long idInquilino);

    // TODO: SP_OBTENER_INQUILINO_POR_ID_PERSONA_DETALLE
    Optional<Inquilino> getInquilinoByIdPersona(Long idPersona) throws Exception;

    Inquilino createUsuarioInquilino(CrearInquilinoDTO crearInquilinoDTO) throws Exception;

    Inquilino updateUsuarioInquilino(Long idInquilino, ActualizarInquilinoDTO actualizarInquilinoDTO) throws Exception;

    void updateEstadoUsuarioInquilino(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
