package com.sgcc.meter.application;

import com.sgcc.meter.domain.Meter;
import com.sgcc.meter.domain.MeterRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MeterService {

    private final MeterRepository meterRepository;

    public MeterService(MeterRepository meterRepository) {
        this.meterRepository = meterRepository;
    }

    @Transactional(readOnly = true)
    public List<Meter> findAll() {
        return meterRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Meter> findById(String id) {
        return meterRepository.findById(Identifier.from(id));
    }

    public Meter create(String unitId, String serviceId, String serialNumber) {
        Meter meter = new Meter(unitId, serviceId, serialNumber);
        return meterRepository.save(meter);
    }
}
