package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.entity.Componente;

import java.util.List;
import java.util.Optional;

public interface IComponenteService {
    List<Componente> getAllComponentes();

    List<Componente> getAllComponentesByIdComponentePadre(Long idComponentePadre);

    Optional<Componente> getComponenteByIdComponente(Long idComponente);

    Componente createComponente(Componente componente) throws Exception;

    Componente updateComponente(Long idComponente, Componente componente) throws Exception;

    void updateEstadoComponente(CambioEstadoDTO cambioEstadoDTO) throws Exception;
}
