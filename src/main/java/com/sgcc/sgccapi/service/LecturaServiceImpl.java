package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.*;
import com.sgcc.sgccapi.model.Consumo;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Lectura;
import com.sgcc.sgccapi.model.Recibo;
import com.sgcc.sgccapi.repository.IConsumoRepository;
import com.sgcc.sgccapi.repository.ILecturaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class LecturaServiceImpl implements ILecturaService {
    private static final String ESTADO_ACTIVO = "A";
    private static final String ESTADO_BAJA = "B";
    private static final long LECTURA_0 = 0L;
    private static final long CONSUMO_0 = 0L;
    private static final long RECIBO_0 = 0L;
    private final ILecturaRepository lecturaRepository;
    private final InquilinoServiceImpl inquilinoService;
    private final ReciboServiceImpl reciboService;
    private final IConsumoRepository consumoRepository;

    public LecturaServiceImpl(ILecturaRepository lecturaRepository,
                              InquilinoServiceImpl inquilinoService,
                              ReciboServiceImpl reciboService,
                              IConsumoRepository consumoRepository) {
        this.lecturaRepository = lecturaRepository;
        this.inquilinoService = inquilinoService;
        this.reciboService = reciboService;
        this.consumoRepository = consumoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lectura> getAllLecturas() {
        return lecturaRepository.findAll()
                .stream().filter(l -> !l.getIdLectura().equals(LECTURA_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LecturasDTO> getAllLecturasWithDetails() {
        return lecturaRepository.findAllWithDetails();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lectura> getAllLecturasByIdInquilino(Long idInquilino) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(idInquilino)
                .orElseThrow(() -> new Exception("El inquilino no existe"));

        return lecturaRepository.findByInquilino(inquilinoFound);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lectura> getAllLecturasByIdRecibo(Long idRecibo) throws Exception {
        Recibo reciboFound = reciboService.getReciboByIdRecibo(idRecibo, false)
                .orElseThrow(() -> new Exception("El recibo no existe"));

        return lecturaRepository.findByRecibo(reciboFound);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Lectura> getLecturaByIdLectura(Long idLectura) {
        if (idLectura == LECTURA_0) {
            return Optional.empty();
        }

        return lecturaRepository.findById(idLectura);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LecturasDTO> getLecturaByIdInquilinoAndMesLectura(Long idInquilino, String mesLectura) {
        return lecturaRepository.findByIdInquilinoAndMesLectura(idInquilino, mesLectura);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Consumo> getAllConsumos() {
        return consumoRepository.findAll()
                .stream()
                .filter(c -> !c.getIdConsumo().equals(CONSUMO_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Consumo> getConsumoByIdConsumo(Long idConsumo) {
        if (idConsumo == CONSUMO_0) {
            return Optional.empty();
        }

        return consumoRepository.findById(idConsumo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Consumo> getConsumoByIdLectura(Long idLectura) throws Exception {
        Optional<Lectura> lecturaFound = getLecturaByIdLectura(idLectura);

        if (idLectura == LECTURA_0 || lecturaFound.isEmpty()) {
            throw new Exception("La lectura no existe");
        }

        return consumoRepository.findByLectura(lecturaFound.get());
    }

    @Override
    @Transactional
    public void createLectura(CrearLecturaDTO crearLecturaDTO) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(crearLecturaDTO.getIdInquilino())
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        Recibo reciboFound = reciboService.getReciboByIdRecibo(crearLecturaDTO.getIdRecibo(), true)
                .orElseThrow(() -> new Exception("El recibo no existe"));

        String currentMonth = String.valueOf(LocalDateTime.now().getMonthValue());
        Optional<LecturasDTO> currentLecturaFound = getLecturaByIdInquilinoAndMesLectura(inquilinoFound.getIdInquilino(),
                currentMonth);

        if (currentLecturaFound.isPresent()) {
            throw new Exception("La lectura de este mes ya existe.");
        }

        String lastMonth = String.valueOf(LocalDateTime.now().getMonthValue() - 1);
        Optional<LecturasDTO> lastLecturaFound = getLecturaByIdInquilinoAndMesLectura(inquilinoFound.getIdInquilino(),
                lastMonth);

        Lectura lastLectura = new Lectura();
        int lastLecturaMedidor = 0;

        if (lastLecturaFound.isEmpty()) {
            Recibo reciboTemp = reciboService.getReciboByIdRecibo(RECIBO_0, true)
                    .orElseThrow(() -> new Exception("Hubo un error a la hora de registrar la lectura."));

            lastLectura.setInquilino(inquilinoFound);
            lastLectura.setRecibo(reciboTemp);
            lastLectura.setLecturaMedidorAnterior(0);
            lastLectura.setLecturaMedidorActual(0);
            lastLectura.setFechaCreacion(LocalDateTime.now());

            lecturaRepository.save(lastLectura);

            lastLecturaMedidor = lastLectura.getLecturaMedidorActual();
        } else {
            lastLecturaMedidor = lastLecturaFound.get().getLecturaMedidorActual();
        }

        Lectura newLectura = new Lectura();
        newLectura.setInquilino(inquilinoFound);
        newLectura.setRecibo(reciboFound);
        newLectura.setLecturaMedidorAnterior(lastLecturaMedidor);
        newLectura.setLecturaMedidorActual(crearLecturaDTO.getLecturaMedidorActual());
        newLectura.setFechaCreacion(LocalDateTime.now());

        lecturaRepository.save(newLectura);

        double consumoInquilino = newLectura.getLecturaMedidorActual() - newLectura.getLecturaMedidorAnterior();

        if (consumoInquilino < 0) {
            throw new Exception("La lectura actual no puede ser menor a la lectura anterior");
        }

        double totalAPagar = consumoInquilino * reciboFound.getConsumoUnitario();
        createConsumo(newLectura, new CrearConsumoDTO(newLectura.getIdLectura(), totalAPagar));
    }

    @Transactional
    private void createConsumo(Lectura lectura, CrearConsumoDTO crearConsumoDTO) {
        Consumo newConsumo = new Consumo();
        newConsumo.setLectura(lectura);
        newConsumo.setConsumoImporte(crearConsumoDTO.getConsumoImporte());
        newConsumo.setFechaCreacion(LocalDateTime.now());

        consumoRepository.save(newConsumo);
    }

    @Override
    @Transactional
    public void updateLectura(Long idLectura, ActualizarLecturaDTO actualizarLecturaDTO) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(actualizarLecturaDTO.getIdInquilino())
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        Recibo reciboFound = reciboService.getReciboByIdRecibo(actualizarLecturaDTO.getIdRecibo(), false)
                .orElseThrow(() -> new Exception("El recibo no existe"));
        Lectura lecturaFound = getLecturaByIdLectura(idLectura)
                .orElseThrow(() -> new Exception("La lectura no existe"));
        lecturaFound.setInquilino(inquilinoFound);
        lecturaFound.setRecibo(reciboFound);
        lecturaFound.setLecturaMedidorAnterior(actualizarLecturaDTO.getLecturaMedidorAnterior());
        lecturaFound.setLecturaMedidorActual(actualizarLecturaDTO.getLecturaMedidorActual());
        lecturaFound.setFechaActualizacion(LocalDateTime.now());

        lecturaRepository.save(lecturaFound);
        double consumoInquilino = lecturaFound.getLecturaMedidorActual() - lecturaFound.getLecturaMedidorAnterior();

        if (consumoInquilino < 0) {
            throw new Exception("La lectura actual no puede ser menor a la lectura anterior");
        }

        double totalAPagar = consumoInquilino * reciboFound.getConsumoUnitario();
        updateConsumo(actualizarLecturaDTO.getIdConsumo(), lecturaFound, new ActualizarConsumoDTO(
                actualizarLecturaDTO.getIdConsumo(), idLectura, totalAPagar));
    }

    @Transactional
    private void updateConsumo(Long idConsumo, Lectura lectura, ActualizarConsumoDTO actualizarConsumoDTO)
            throws Exception {
        Consumo consumoFound = consumoRepository.findById(idConsumo)
                .orElseThrow(() -> new Exception("El consumo no existe"));
        consumoFound.setLectura(lectura);
        consumoFound.setConsumoImporte(actualizarConsumoDTO.getConsumoImporte());
        consumoFound.setFechaActualizacion(LocalDateTime.now());

        consumoRepository.save(consumoFound);
    }

    @Override
    @Transactional
    public void updateEstadoLectura(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(cambioEstadoDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Lectura lecturaFound = getLecturaByIdLectura(cambioEstadoDTO.getId())
                .orElseThrow(() -> new Exception("La lectura no existe"));

        lecturaFound.setFechaActualizacion(LocalDateTime.now());
        lecturaFound.setFechaBaja(null);

        if (cambioEstadoDTO.getEstado().equals(ESTADO_BAJA)) {
            lecturaFound.setFechaBaja(LocalDateTime.now());
        }

        updateEstadoConsumo(cambioEstadoDTO);
        lecturaRepository.save(lecturaFound);
    }

    @Transactional
    private void updateEstadoConsumo(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Consumo consumoFound = consumoRepository.findById(cambioEstadoDTO.getId())
                .orElseThrow(() -> new Exception("El consumo no existe"));
        consumoFound.setFechaActualizacion(LocalDateTime.now());
        consumoFound.setFechaBaja(null);

        if (cambioEstadoDTO.getEstado().equals(ESTADO_BAJA)) {
            consumoFound.setFechaBaja(LocalDateTime.now());
        }

        consumoRepository.save(consumoFound);
    }
}
