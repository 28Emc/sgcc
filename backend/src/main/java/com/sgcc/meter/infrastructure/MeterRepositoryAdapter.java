package com.sgcc.meter.infrastructure;

import com.sgcc.meter.domain.Meter;
import com.sgcc.meter.domain.MeterRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class MeterRepositoryAdapter implements MeterRepository {

    private final MeterJpaRepository repository;

    public MeterRepositoryAdapter(MeterJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Meter> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Meter> findAll() {
        return repository.findAll();
    }

    @Override
    public Meter save(Meter entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Meter entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Meter> findByUnitId(String unitId) {
        return repository.findByUnitId(unitId);
    }

    @Override
    public List<Meter> findByServiceId(String serviceId) {
        return repository.findByServiceId(serviceId);
    }

    @Override
    public Optional<Meter> findBySerialNumber(String serialNumber) {
        return repository.findBySerialNumber(serialNumber);
    }
}
