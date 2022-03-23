package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Long> {
}
