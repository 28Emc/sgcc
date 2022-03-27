package com.sgcc.sgccapi.model.repository;

import com.sgcc.sgccapi.model.entity.Persona;
import com.sgcc.sgccapi.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);

    Optional<Usuario> findByPersona(Persona persona);
}

