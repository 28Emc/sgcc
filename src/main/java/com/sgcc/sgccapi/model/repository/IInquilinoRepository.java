package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Inquilino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IInquilinoRepository extends JpaRepository<Inquilino, Long> {
}
