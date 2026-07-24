package com.sgcc.occupancy.infrastructure;

import com.sgcc.occupancy.domain.Occupancy;
import com.sgcc.occupancy.domain.OccupancyRepository;
import com.sgcc.shared.domain.Identifier;
import com.sgcc.shared.domain.Status;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class OccupancyRepositoryAdapter implements OccupancyRepository {

    private final OccupancyJpaRepository repository;

    public OccupancyRepositoryAdapter(OccupancyJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Occupancy> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Occupancy> findAll() {
        return repository.findAll();
    }

    @Override
    public Occupancy save(Occupancy entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Occupancy entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Occupancy> findByUnitIdAndStatus(String unitId, Status status) {
        return repository.findByUnitIdAndStatus(unitId, status);
    }

    @Override
    public Optional<Occupancy> findByTenantIdAndStatus(String tenantId, Status status) {
        return repository.findByTenantIdAndStatus(tenantId, status);
    }

    @Override
    public List<Occupancy> findByTenantId(String tenantId) {
        return repository.findByTenantId(tenantId);
    }
}
