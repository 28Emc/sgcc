package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.constant.TiposReciboSGCC;
import com.sgcc.sgccapi.dto.ActualizarReciboDTO;
import com.sgcc.sgccapi.dto.CrearReciboDTO;
import com.sgcc.sgccapi.model.Recibo;
import com.sgcc.sgccapi.model.TipoRecibo;
import com.sgcc.sgccapi.repository.IReciboRepository;
import com.sgcc.sgccapi.util.PDFManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.sgcc.sgccapi.constant.ServiceConstants.*;

@Service
public class ReciboServiceImpl implements IReciboService {

    private final IReciboRepository reciboRepository;
    private final TipoReciboServiceImpl tipoReciboService;

    private final PDFManager pdfManager;

    public ReciboServiceImpl(IReciboRepository reciboRepository,
                             TipoReciboServiceImpl tipoReciboService,
                             PDFManager pdfManager) {
        this.reciboRepository = reciboRepository;
        this.tipoReciboService = tipoReciboService;
        this.pdfManager = pdfManager;
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
    public Optional<Recibo> getReciboByIdRecibo(Long idRecibo, boolean forceSearch) {
        if (idRecibo == RECIBO_0 && !forceSearch) {
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
    public void createRecibo(CrearReciboDTO crearReciboDTO) throws Exception {
        TipoRecibo tipoReciboFound = tipoReciboService.getTipoReciboByIdTipoRecibo(crearReciboDTO.getIdTipoRecibo())
                .orElseThrow(() -> new Exception("El tipo de recibo no existe."));

        Optional<Recibo> reciboFound = getReciboByTipoReciboAndMesReciboAndDireccionRecibo(
                tipoReciboFound.getIdTipoRecibo(), crearReciboDTO.getMesRecibo(),
                crearReciboDTO.getDireccionRecibo());

        if (reciboFound.isPresent()) {
            throw new Exception("El recibo a crear ya existe.");
        }

        reciboRepository.save(new Recibo(tipoReciboFound, null, crearReciboDTO.getMesRecibo(),
                crearReciboDTO.getConsumoUnitario(), crearReciboDTO.getConsumoTotal(), crearReciboDTO.getImporte(),
                crearReciboDTO.getDireccionRecibo(), LocalDateTime.now()));
    }

    @Override
    @Transactional
    public void createReciboWithPDF(Long idTipoRecibo, MultipartFile file) throws Exception {
        if (file == null) {
            throw new Exception("El recibo en PDF es requerido");
        }

        TipoRecibo tipoReciboFound = tipoReciboService.getTipoReciboByIdTipoRecibo(idTipoRecibo)
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));
        TiposReciboSGCC tipoReciboSGCC = getTipoReciboEnum(tipoReciboFound);
        CrearReciboDTO crearReciboDTO = pdfManager.readFromMultipartFile(tipoReciboSGCC, file);
        Optional<Recibo> reciboFound = getReciboByTipoReciboAndMesReciboAndDireccionRecibo(
                tipoReciboFound.getIdTipoRecibo(), crearReciboDTO.getMesRecibo(), crearReciboDTO.getDireccionRecibo());

        if (reciboFound.isPresent()) {
            throw new Exception("El recibo a crear ya existe.");
        }

        String urlRecibo = uploadReciboToCloudStorage(crearReciboDTO.getMesRecibo(), tipoReciboFound, file);
        reciboRepository.save(new Recibo(tipoReciboFound, urlRecibo, crearReciboDTO.getMesRecibo(),
                crearReciboDTO.getConsumoUnitario(), crearReciboDTO.getConsumoTotal(), crearReciboDTO.getImporte(),
                crearReciboDTO.getDireccionRecibo(), LocalDateTime.now()));
    }

    @Override
    @Transactional
    public void updateRecibo(Long idRecibo, ActualizarReciboDTO actualizarReciboDTO) throws Exception {
        Recibo reciboFound = getReciboByIdRecibo(idRecibo, false)
                .orElseThrow(() -> new Exception("el recibo no existe"));
        TipoRecibo tipoReciboFound = tipoReciboService
                .getTipoReciboByIdTipoRecibo(actualizarReciboDTO.getIdTipoRecibo())
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));
        reciboFound.setTipoRecibo(tipoReciboFound);
        reciboFound.setUrlArchivo(actualizarReciboDTO.getUrlArchivo());
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
        Recibo reciboFound = getReciboByIdRecibo(idRecibo, false)
                .orElseThrow(() -> new Exception("el recibo no existe"));
        String urlRecibo = uploadReciboToCloudStorage(reciboFound.getMesRecibo(), reciboFound.getTipoRecibo(), file);
        reciboFound.setUrlArchivo(urlRecibo);
        reciboFound.setFechaActualizacion(LocalDateTime.now());
        reciboRepository.save(reciboFound);
    }

    private String uploadReciboToCloudStorage(String mesRecibo, TipoRecibo tipoRecibo, MultipartFile file) {
        String urlFilename = "";
        String dateFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATETIME_FORMAT));
        urlFilename = "/recibo-"
                .concat(tipoRecibo.getTipoRecibo().toLowerCase())
                .concat("-")
                .concat(mesRecibo.toLowerCase())
                .concat("-")
                .concat(dateFormat);

        // TODO: SUBIR ARCHIVO PDF DE RECIBO AL CLOUD STORAGE Y OBTENER EL URL DEL FILE

        if (!urlFilename.contains("http://") || !urlFilename.contains("https://")) {
            urlFilename = null;
        }

        return urlFilename;
    }

    private TiposReciboSGCC getTipoReciboEnum(TipoRecibo tipoRecibo) throws Exception {
        TiposReciboSGCC tiposReciboSGCC;
        switch (tipoRecibo.getTipoRecibo().toUpperCase()) {
            case "LUZ":
                tiposReciboSGCC = TiposReciboSGCC.LUZ;
                break;
            case "AGUA":
                tiposReciboSGCC = TiposReciboSGCC.AGUA;
                break;
            case "GAS":
                tiposReciboSGCC = TiposReciboSGCC.GAS;
                break;
            default:
                throw new Exception("El tipo de recibo es inválido.");
        }

        return tiposReciboSGCC;
    }
}
