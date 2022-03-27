package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarPermisoDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearPermisoDTO;
import com.sgcc.sgccapi.model.entity.Permiso;

import java.util.List;
import java.util.Optional;

public interface IPermisoService {
    List<Permiso> getAllPermisos();

    List<Permiso> getAllPermisosByIdRol(Long idRol) throws Exception;

    Optional<Permiso> getPermisoByIdPermiso(Long idPermiso);

    Permiso createPermiso(CrearPermisoDTO crearPermisoDTO) throws Exception;

    Permiso updatePermiso(Long idPermiso, ActualizarPermisoDTO actualizarPermisoDTO) throws Exception;

    void updateEstadoPermiso(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
