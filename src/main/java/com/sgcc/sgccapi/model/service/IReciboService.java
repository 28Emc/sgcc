package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarReciboDTO;
import com.sgcc.sgccapi.model.entity.Recibo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IReciboService {
    List<Recibo> getAllRecibos();

    Optional<Recibo> getReciboByIdRecibo(Long idRecibo);

    Optional<Recibo> getReciboByTipoReciboAndMesReciboAndDireccionRecibo(Long idTipoRecibo, String mes,
                                                                         String direccion) throws Exception;

    Recibo createRecibo(String creciboDTO, MultipartFile file) throws Exception;

    Recibo updateRecibo(Long idRecibo, ActualizarReciboDTO actualizarReciboDTO) throws Exception;

    Recibo updateUrlRecibo(Long idRecibo, MultipartFile file) throws Exception;
}
