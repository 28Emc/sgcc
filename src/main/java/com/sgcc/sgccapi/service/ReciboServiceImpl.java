package com.sgcc.sgccapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgcc.sgccapi.dto.ActualizarReciboDTO;
import com.sgcc.sgccapi.dto.CrearReciboDTO;
import com.sgcc.sgccapi.model.Recibo;
import com.sgcc.sgccapi.model.TipoRecibo;
import com.sgcc.sgccapi.repository.IReciboRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReciboServiceImpl implements IReciboService {
    private static final long RECIBO_0 = 0L;
    private static final long TIPO_RECIBO_0 = 0L;
    private final IReciboRepository reciboRepository;
    private final TipoReciboServiceImpl tipoReciboService;

    public ReciboServiceImpl(IReciboRepository reciboRepository, TipoReciboServiceImpl tipoReciboService) {
        this.reciboRepository = reciboRepository;
        this.tipoReciboService = tipoReciboService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Recibo> getAllRecibos() {
        return reciboRepository.findAll()
                .stream().filter(r -> !r.getIdRecibo().equals(RECIBO_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Recibo> getReciboByIdRecibo(Long idRecibo) {
        if (idRecibo == RECIBO_0) {
            return Optional.empty();
        }

        return reciboRepository.findById(idRecibo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Recibo> getReciboByTipoReciboAndMesReciboAndDireccionRecibo(Long idTipoRecibo, String mes,
                                                                                String direccion) throws Exception {
        TipoRecibo tipoReciboFound = tipoReciboService.getTipoReciboByIdTipoRecibo(idTipoRecibo)
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));

        return reciboRepository.findByTipoReciboAndMesReciboAndDireccionRecibo(tipoReciboFound, mes, direccion);
    }

    @Override
    @Transactional
    public void createRecibo(String reciboDTO, MultipartFile file) throws Exception {
        if (file == null) {
            throw new Exception("El recibo en PDF es requerido");
        }

        ObjectMapper mapper = new ObjectMapper();
        CrearReciboDTO crearReciboDTO = mapper.readValue(reciboDTO, CrearReciboDTO.class);

        if (crearReciboDTO.getIdTipoRecibo() == null
                || crearReciboDTO.getIdTipoRecibo().equals(TIPO_RECIBO_0)) {
            throw new Exception("El tipo de recibo no existe o no ha sido especificado");
        }

        if (crearReciboDTO.getMesRecibo() == null
                || crearReciboDTO.getMesRecibo().trim().length() == 0) {
            throw new Exception("El mes del recibo es requerido");
        }

        if (crearReciboDTO.getDireccionRecibo() == null
                || crearReciboDTO.getDireccionRecibo().trim().length() == 0) {
            throw new Exception("La dirección del recibo es requerida");
        }

        TipoRecibo tipoReciboFound = tipoReciboService
                .getTipoReciboByIdTipoRecibo(crearReciboDTO.getIdTipoRecibo())
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));
        Optional<Recibo> reciboFound = getReciboByTipoReciboAndMesReciboAndDireccionRecibo(
                tipoReciboFound.getIdTipoRecibo(), crearReciboDTO.getMesRecibo(),
                crearReciboDTO.getDireccionRecibo());

        if (reciboFound.isPresent()) {
            throw new Exception("El recibo a crear ya existe");
        }

        String urlRecibo = uploadReciboToCloudStorage(crearReciboDTO.getMesRecibo(), tipoReciboFound, file);

        reciboRepository.save(new Recibo(tipoReciboFound, urlRecibo, crearReciboDTO.getMesRecibo(),
                crearReciboDTO.getConsumoUnitario(), crearReciboDTO.getImporte(),
                crearReciboDTO.getDireccionRecibo(), LocalDateTime.now()));
    }

    @Override
    @Transactional
    public void updateRecibo(Long idRecibo, ActualizarReciboDTO actualizarReciboDTO) throws Exception {
        Recibo reciboFound = getReciboByIdRecibo(idRecibo)
                .orElseThrow(() -> new Exception("el recibo no existe"));
        TipoRecibo tipoReciboFound = tipoReciboService
                .getTipoReciboByIdTipoRecibo(actualizarReciboDTO.getIdTipoRecibo())
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));
        reciboFound.setTipoRecibo(tipoReciboFound);
        reciboFound.setUrlArchivo(actualizarReciboDTO.getUrlRecibo());
        reciboFound.setMesRecibo(actualizarReciboDTO.getMesRecibo());
        reciboFound.setDireccionRecibo(actualizarReciboDTO.getDireccionRecibo());
        reciboFound.setConsumoUnitario(actualizarReciboDTO.getConsumoUnitario());
        reciboFound.setImporte(actualizarReciboDTO.getImporte());
        reciboFound.setFechaActualizacion(LocalDateTime.now());

        reciboRepository.save(reciboFound);
    }

    @Override
    @Transactional
    public void updateUrlRecibo(Long idRecibo, MultipartFile file) throws Exception {
        Recibo reciboFound = getReciboByIdRecibo(idRecibo)
                .orElseThrow(() -> new Exception("el recibo no existe"));
        String urlRecibo = uploadReciboToCloudStorage(reciboFound.getMesRecibo(), reciboFound.getTipoRecibo(), file);
        reciboFound.setUrlArchivo(urlRecibo);
        reciboFound.setFechaActualizacion(LocalDateTime.now());

        reciboRepository.save(reciboFound);
    }

    @Transactional
    private String uploadReciboToCloudStorage(String mesRecibo, TipoRecibo tipoRecibo, MultipartFile file)
            throws Exception {
        String urlFilename = "";
        String dateFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss"));
        urlFilename = "/recibo-"
                .concat(tipoRecibo.getTipoRecibo().toLowerCase())
                .concat("-")
                .concat(mesRecibo.toLowerCase())
                .concat("-")
                .concat(dateFormat);

        // TODO: SUBIR ARCHIVO PDF DE RECIBO AL CLOUD STORAGE Y OBTENER EL URL DEL FILE

        return urlFilename;
    }
}
