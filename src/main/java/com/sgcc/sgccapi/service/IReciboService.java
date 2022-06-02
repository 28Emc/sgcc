package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarReciboDTO;
import com.sgcc.sgccapi.dto.CrearReciboDTO;
import com.sgcc.sgccapi.model.Recibo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IReciboService {
    List<Recibo> getAllRecibos();

    Optional<Recibo> getReciboByIdRecibo(Long idRecibo, boolean forceSearch);

    Optional<Recibo> getReciboByTipoReciboAndMesReciboAndDireccionRecibo(Long idTipoRecibo, String mes,
                                                                         String direccion) throws Exception;

    void createRecibo(CrearReciboDTO crearReciboDTO) throws Exception;

    void createReciboWithPDF(Long idTipoRecibo, MultipartFile file) throws Exception;

    void updateRecibo(Long idRecibo, ActualizarReciboDTO actualizarReciboDTO) throws Exception;

    void updateUrlRecibo(Long idRecibo, MultipartFile file) throws Exception;
}
