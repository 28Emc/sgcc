package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByRol(String rol);

    Optional<Rol> findByRolIgnoreCaseContaining(String rol);
}
