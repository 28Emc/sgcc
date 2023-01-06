package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.dto.PermisosPorRolDTO;
import com.sgcc.sgccapi.model.Componente;
import com.sgcc.sgccapi.model.Permiso;
import com.sgcc.sgccapi.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPermisoRepository extends JpaRepository<Permiso, Long> {
    List<Permiso> findAllByRol(Rol rol);

    List<Permiso> findAllByComponente(Componente componente);

    Optional<Permiso> findByRolAndComponente(Rol rol, Componente componente);

    Optional<Permiso> findByIdPermisoAndRol(Long idPermiso, Rol rol);

    @Procedure("sp_ObtenerPermisosPorRol")
    List<PermisosPorRolDTO> spObtenerPermisosPorRol(Long idRol);
}
