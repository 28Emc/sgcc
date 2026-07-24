package com.sgcc.unit.application;

import com.sgcc.property.domain.Unit;
import com.sgcc.unit.infrastructure.UnitJpaRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UnitService {

    private final UnitJpaRepository unitJpaRepository;

    public UnitService(UnitJpaRepository unitJpaRepository) {
        this.unitJpaRepository = unitJpaRepository;
    }

    @Transactional(readOnly = true)
    public List<Unit> findAll() {
        return unitJpaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Unit> findById(String id) {
        return unitJpaRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Unit> findByPropertyId(String propertyId) {
        return unitJpaRepository.findByPropertyId(propertyId);
    }

    public Unit create(String propertyId, String name, String description) {
        Unit unit = new Unit(propertyId, name, description);
        return unitJpaRepository.save(unit);
    }

    public Optional<Unit> update(String id, String propertyId, String name, String description) {
        return unitJpaRepository.findById(id)
                .map(existing -> {
                    Unit updated = new Unit(propertyId, name, description);
                    return unitJpaRepository.save(updated);
                });
    }

    public void delete(String id) {
        unitJpaRepository.findById(id)
                .ifPresent(unitJpaRepository::delete);
    }
}
