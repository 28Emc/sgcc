package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarMedidorDTO;
import com.sgcc.sgccapi.dto.CrearMedidorDTO;
import com.sgcc.sgccapi.model.Medidor;

import java.util.List;
import java.util.Optional;

public interface IMedidorService {
    List<Medidor> getAllMedidores();

    Optional<Medidor> getMedidorByIdMedidor(Long idMedidor);

    Optional<Medidor> getMedidorByCodigoMedidor(String codigoMedidor);

    void createMedidor(CrearMedidorDTO crearMedidorDTO) throws Exception;

    void updateMedidor(Long idMedidor, ActualizarMedidorDTO actualizarMedidorDTO) throws Exception;
}
