package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.model.TipoRecibo;
import com.sgcc.sgccapi.repository.ITipoReciboRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TipoReciboServiceImpl implements ITipoReciboService {
    private static final long TIPO_RECIBO_0 = 0L;
    private final ITipoReciboRepository tipoReciboRepository;

    public TipoReciboServiceImpl(ITipoReciboRepository tipoReciboRepository) {
        this.tipoReciboRepository = tipoReciboRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoRecibo> getAllTiposRecibo() {
        return tipoReciboRepository.findAll()
                .stream().filter(t -> !t.getIdTipoRecibo().equals(TIPO_RECIBO_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TipoRecibo> getTipoReciboByIdTipoRecibo(Long idTipoRecibo) {
        if (idTipoRecibo == TIPO_RECIBO_0) {
            return Optional.empty();
        }

        return tipoReciboRepository.findById(idTipoRecibo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TipoRecibo> getTipoReciboByTipoRecibo(String tipoRecibo) {
        return tipoReciboRepository.findByTipoRecibo(tipoRecibo);
    }

    @Override
    @Transactional
    public void createTipoRecibo(TipoRecibo tipoRecibo) throws Exception {
        Optional<TipoRecibo> tipoReciboFound = getTipoReciboByTipoRecibo(tipoRecibo.getTipoRecibo());

        if (tipoReciboFound.isPresent()) {
            throw new Exception("El tipo de recibo ya existe");
        }

        tipoReciboRepository.save(tipoRecibo);
    }

    @Override
    @Transactional
    public void updateTipoRecibo(Long idTipoRecibo, TipoRecibo tipoRecibo) throws Exception {
        TipoRecibo tipoReciboFound = getTipoReciboByIdTipoRecibo(idTipoRecibo)
                .orElseThrow(() -> new Exception("El tipo de recibo no existe"));

        tipoReciboFound.setTipoRecibo(tipoRecibo.getTipoRecibo());
        tipoReciboFound.setDescripcion(tipoRecibo.getDescripcion());

        tipoReciboRepository.save(tipoReciboFound);
    }
}
