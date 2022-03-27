package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarPersonaDTO;
import com.sgcc.sgccapi.model.DTO.CrearPersonaDTO;
import com.sgcc.sgccapi.model.entity.Persona;

import java.util.List;
import java.util.Optional;

public interface IPersonaService {
    // TODO: SP_LISTAR_PERSONAS_DETALLE
    List<Persona> getAllPersonas();

    // TODO: SP_OBTENER_PERSONA_POR_ID_DETALLE
    Optional<Persona> getPersonaByIdPersona(Long idPersona);

    Optional<Persona> getPersonaByNroDocumento(String nroDocumento);

    Persona createPersona(CrearPersonaDTO crearPersonaDTO) throws Exception;

    Persona updatePersona(Long idPersona, ActualizarPersonaDTO actualizarPersonaDTO) throws Exception;
}
