package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarPersonaDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearPersonaDTO;
import com.sgcc.sgccapi.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    // TODO: SP_LISTAR_USUARIOS_DETALLE
    List<Usuario> getAllUsuarios();

    // TODO: SP_OBTENER_USUARIO_POR_ID_DETALLE
    Optional<Usuario> getUsuarioByIdUsuario(Long idUsuario);

    // TODO: SP_OBTENER_USUARIO_POR_USUARIO_DETALLE
    Optional<Usuario> getUsuarioByUsuario(String usuario);

    // TODO: SP_OBTENER_USUARIO_POR_USUARIO_DETALLE
    Optional<Usuario> getUsuarioByPersona(Long idPersona) throws Exception;

    void createUsuario(CrearPersonaDTO crearPersonaDTO) throws Exception;

    void updateUsuario(Long idUsuario, ActualizarPersonaDTO actualizarPersonaDTO) throws Exception;

    void updateEstadoUsuario(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
