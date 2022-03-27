package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarRolDTO;
import com.sgcc.sgccapi.model.DTO.CrearRolDTO;
import com.sgcc.sgccapi.model.entity.Rol;

import java.util.List;
import java.util.Optional;

public interface IRolService {
    List<Rol> getAllRoles();

    Optional<Rol> getRolByIdRol(Long idRol);

    Rol createRol(CrearRolDTO crearRolDTO) throws Exception;

    Rol updateRol(Long idRol, ActualizarRolDTO actualizarRolDTO) throws Exception;
}
