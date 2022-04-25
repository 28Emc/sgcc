package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarInquilinoDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearInquilinoDTO;
import com.sgcc.sgccapi.dto.ListaInquilinosDTO;
import com.sgcc.sgccapi.model.Inquilino;

import java.util.List;
import java.util.Optional;

public interface IInquilinoService {

    List<Inquilino> getAllInquilinos();

    List<ListaInquilinosDTO> getAllInquilinosDetail();

    // TODO: SP_OBTENER_INQUILINO_POR_ID_DETALLE
    Optional<Inquilino> getInquilinoByIdInquilino(Long idInquilino);

    // TODO: SP_OBTENER_INQUILINO_POR_ID_PERSONA_DETALLE
    Optional<Inquilino> getInquilinoByIdPersona(Long idPersona) throws Exception;

    void createUsuarioInquilino(CrearInquilinoDTO crearInquilinoDTO) throws Exception;

    void updateUsuarioInquilino(Long idInquilino, ActualizarInquilinoDTO actualizarInquilinoDTO) throws Exception;

    void updateEstadoUsuarioInquilino(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
