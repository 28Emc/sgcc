package com.sgcc.sgccapi.repository;

import com.sgcc.sgccapi.dto.UsuarioDTO;
import com.sgcc.sgccapi.model.Persona;
import com.sgcc.sgccapi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);

    @Query(nativeQuery = true, value = "CALL sp_ObtenerUsuarioYRolesPorUsuario(:usuario)")
    Optional<UsuarioDTO> validateUsuario(String usuario);

    Optional<Usuario> findByPersona(Persona persona);
}

