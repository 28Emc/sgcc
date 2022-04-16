package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.*;
import com.sgcc.sgccapi.model.entity.Permiso;

import java.util.List;
import java.util.Optional;

public interface IPermisoService {
    List<Permiso> getAllPermisos();

    List<Permiso> getAllPermisosByIdRol(Long idRol) throws Exception;

    List<PermisosPorRolDTO> spObtenerPermisosPorRol(Long idRol) throws Exception;

    Optional<Permiso> getPermisoByIdPermiso(Long idPermiso);

    Permiso createPermiso(CrearPermisoDTO crearPermisoDTO) throws Exception;

    Permiso updatePermiso(Long idPermiso, ActualizarPermisoDTO actualizarPermisoDTO) throws Exception;

    void updateOrCreatePermisosComponentes(PermisosComponentesDTO permisosComponentesDTO) throws Exception;

    void updateEstadoPermiso(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
