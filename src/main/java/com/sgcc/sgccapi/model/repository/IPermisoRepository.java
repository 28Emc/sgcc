package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.DTO.PermisosPorRolDTO;
import com.sgcc.sgccapi.model.entity.Componente;
import com.sgcc.sgccapi.model.entity.Permiso;
import com.sgcc.sgccapi.model.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPermisoRepository extends JpaRepository<Permiso, Long> {
    List<Permiso> findAllByRol(Rol rol);

    Optional<Permiso> findByRolAndComponente(Rol rol, Componente componente);

    Optional<Permiso> findByIdPermisoAndRol(Long idPermiso, Rol rol);

    @Query(nativeQuery = true, value = "CALL sp_ObtenerPermisosPorRol(:idRol)")
    List<PermisosPorRolDTO> spObtenerPermisosPorRol(Long idRol);
}
