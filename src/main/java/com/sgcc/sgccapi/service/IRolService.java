package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarRolDTO;
import com.sgcc.sgccapi.dto.CrearRolDTO;
import com.sgcc.sgccapi.model.Rol;

import java.util.List;
import java.util.Optional;

public interface IRolService {
    List<Rol> getAllRoles();

    Optional<Rol> getRolByIdRol(Long idRol);

    void createRol(CrearRolDTO crearRolDTO) throws Exception;

    void updateRol(Long idRol, ActualizarRolDTO actualizarRolDTO) throws Exception;
}
