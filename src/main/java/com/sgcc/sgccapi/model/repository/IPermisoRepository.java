package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPermisoRepository extends JpaRepository<Permiso, Long> {
}
