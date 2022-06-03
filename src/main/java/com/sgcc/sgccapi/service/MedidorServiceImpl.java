package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarMedidorDTO;
import com.sgcc.sgccapi.dto.CrearMedidorDTO;
import com.sgcc.sgccapi.model.Medidor;
import com.sgcc.sgccapi.repository.IMedidorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.sgcc.sgccapi.constant.ServiceConstants.MEDIDOR_0;

@Service
public class MedidorServiceImpl implements IMedidorService {

    private final IMedidorRepository medidorRepository;

    public MedidorServiceImpl(IMedidorRepository medidorRepository) {
        this.medidorRepository = medidorRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medidor> getAllMedidores() {
        return medidorRepository.findAll()
                .stream().filter(m -> !m.getIdMedidor().equals(MEDIDOR_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Medidor> getMedidorByIdMedidor(Long idMedidor) {
        if (idMedidor == MEDIDOR_0) {
            return Optional.empty();
        }

        return medidorRepository.findById(idMedidor);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Medidor> getMedidorByCodigoMedidor(String codigoMedidor) {
        return medidorRepository.findByCodigoMedidor(codigoMedidor);
    }

    @Override
    @Transactional
    public void createMedidor(CrearMedidorDTO crearMedidorDTO) throws Exception {
        Optional<Medidor> medidorFound = getMedidorByCodigoMedidor(crearMedidorDTO.getCodigoMedidor());

        if (medidorFound.isPresent()) {
            throw new Exception("El medidor ya existe con el código especificado.");
        }

        medidorRepository.save(new Medidor(crearMedidorDTO.getCodigoMedidor(),
                crearMedidorDTO.getDireccionMedidor(), LocalDateTime.now(), null));

    }

    @Override
    @Transactional
    public void updateMedidor(Long idMedidor, ActualizarMedidorDTO actualizarMedidorDTO) throws Exception {
        Medidor medidorFound = getMedidorByIdMedidor(actualizarMedidorDTO.getIdMedidor())
                .orElseThrow(() -> new Exception("El medidor no existe."));

        medidorFound.setCodigoMedidor(actualizarMedidorDTO.getCodigoMedidor());
        medidorFound.setDireccionMedidor(actualizarMedidorDTO.getDireccionMedidor());
        medidorFound.setFechaActualizacion(LocalDateTime.now());

        medidorRepository.save(medidorFound);
    }
}
