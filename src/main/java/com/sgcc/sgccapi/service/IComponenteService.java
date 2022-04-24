package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.model.Componente;

import java.util.List;
import java.util.Optional;

public interface IComponenteService {
    List<Componente> getAllComponentes();

    List<Componente> getAllComponentesByIdComponentePadre(Long idComponentePadre);

    Optional<Componente> getComponenteByIdComponente(Long idComponente);

    void createComponente(Componente componente) throws Exception;

    void updateComponente(Long idComponente, Componente componente) throws Exception;

    void updateEstadoComponente(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
