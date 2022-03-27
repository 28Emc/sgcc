package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.*;
import com.sgcc.sgccapi.model.entity.Consumo;
import com.sgcc.sgccapi.model.entity.Inquilino;
import com.sgcc.sgccapi.model.entity.Lectura;
import com.sgcc.sgccapi.model.entity.Recibo;
import com.sgcc.sgccapi.model.repository.IConsumoRepository;
import com.sgcc.sgccapi.model.repository.ILecturaRepository;
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
    public List<Lectura> getAllLecturasByIdInquilino(Long idInquilino) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(idInquilino)
                .orElseThrow(() -> new Exception("El inquilino no existe"));

        return lecturaRepository.findByInquilino(inquilinoFound);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lectura> getAllLecturasByIdRecibo(Long idRecibo) throws Exception {
        Recibo reciboFound = reciboService.getReciboByIdRecibo(idRecibo)
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
    public List<Lectura> getAllLecturasByIdInquilinoAndIdRecibo(Long idInquilino, Long idRecibo) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(idInquilino)
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        Recibo reciboFound = reciboService.getReciboByIdRecibo(idRecibo)
                .orElseThrow(() -> new Exception("El recibo no existe"));

        return lecturaRepository.findByInquilinoAndRecibo(inquilinoFound, reciboFound);
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
    public Lectura createLectura(CrearLecturaDTO crearLecturaDTO) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(crearLecturaDTO.getIdInquilino())
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        Recibo reciboFound = reciboService.getReciboByIdRecibo(crearLecturaDTO.getIdRecibo())
                .orElseThrow(() -> new Exception("El recibo no existe"));

        Lectura newLectura = new Lectura();
        newLectura.setInquilino(inquilinoFound);
        newLectura.setRecibo(reciboFound);
        newLectura.setLecturaMedidorAnterior(0);
        newLectura.setLecturaMedidorActual(crearLecturaDTO.getLecturaMedidor());
        newLectura.setFechaCreacion(LocalDateTime.now());

        List<Lectura> lecturasFound = getAllLecturasByIdInquilinoAndIdRecibo(inquilinoFound.getIdInquilino(),
                reciboFound.getIdRecibo());

        if (lecturasFound.size() > 0) {
            Lectura lastLectura = lecturasFound.get(lecturasFound.size() - 1);
            newLectura.setLecturaMedidorAnterior(lastLectura.getLecturaMedidorActual());
        }

        lecturaRepository.save(newLectura);

        double consumoInquilino = newLectura.getLecturaMedidorActual() - newLectura.getLecturaMedidorAnterior();

        if (consumoInquilino < 0) {
            throw new Exception("La lectura actual no puede ser menor a la lectura anterior");
        }

        double totalAPagar = consumoInquilino * reciboFound.getConsumoUnitario();
        createConsumo(newLectura, new CrearConsumoDTO(newLectura.getIdLectura(), totalAPagar));

        return newLectura;
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
    public Lectura updateLectura(Long idLectura, ActualizarLecturaDTO actualizarLecturaDTO) throws Exception {
        Inquilino inquilinoFound = inquilinoService.getInquilinoByIdInquilino(actualizarLecturaDTO.getIdInquilino())
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        Recibo reciboFound = reciboService.getReciboByIdRecibo(actualizarLecturaDTO.getIdRecibo())
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

        return lecturaFound;
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
