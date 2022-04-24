package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.*;
import com.sgcc.sgccapi.model.Permiso;

import java.util.List;
import java.util.Optional;

public interface IPermisoService {
    List<Permiso> getAllPermisos();

    List<Permiso> getAllPermisosByIdRol(Long idRol) throws Exception;

    List<PermisosPorRolDTO> spObtenerPermisosPorRol(Long idRol) throws Exception;

    Optional<Permiso> getPermisoByIdPermiso(Long idPermiso);

    void createPermiso(CrearPermisoDTO crearPermisoDTO) throws Exception;

    void updatePermiso(Long idPermiso, ActualizarPermisoDTO actualizarPermisoDTO) throws Exception;

    void updateOrCreatePermisosComponentes(PermisosComponentesDTO permisosComponentesDTO) throws Exception;

    void updateEstadoPermiso(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
