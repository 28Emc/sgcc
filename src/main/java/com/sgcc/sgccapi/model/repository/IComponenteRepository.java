package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Componente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IComponenteRepository extends JpaRepository<Componente, Long> {
    List<Componente> findAllByIdComponentePadre(Long idComponentePadre);

    Optional<Componente> findByComponenteOrRuta(String componente, String ruta);
}
