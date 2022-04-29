package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.model.Componente;
import com.sgcc.sgccapi.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IComponenteRepository extends JpaRepository<Componente, Long> {
    List<Componente> findAllByIdComponentePadre(Long idComponentePadre);

    List<Componente> findByIdComponenteNotIn(List<Long> idComponentesList);

    Optional<Componente> findByComponenteOrRuta(String componente, String ruta);
}
