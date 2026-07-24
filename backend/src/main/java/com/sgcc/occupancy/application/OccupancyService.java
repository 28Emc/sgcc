package com.sgcc.occupancy.application;

import com.sgcc.occupancy.domain.Occupancy;
import com.sgcc.occupancy.domain.OccupancyRepository;
import com.sgcc.shared.domain.Identifier;
import com.sgcc.shared.domain.Status;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OccupancyService {

    private final OccupancyRepository occupancyRepository;

    public OccupancyService(OccupancyRepository occupancyRepository) {
        this.occupancyRepository = occupancyRepository;
    }

    @Transactional(readOnly = true)
    public List<Occupancy> findAll() {
        return occupancyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Occupancy> findById(String id) {
        return occupancyRepository.findById(Identifier.from(id));
    }

    public Occupancy create(String tenantId, String unitId, LocalDate startDate, LocalDate endDate) {
        Occupancy occupancy = new Occupancy(tenantId, unitId, startDate, endDate);
        return occupancyRepository.save(occupancy);
    }

    public Optional<Occupancy> update(String id, String tenantId, String unitId,
                                       LocalDate startDate, LocalDate endDate) {
        return occupancyRepository.findById(Identifier.from(id))
                .map(existing -> {
                    Occupancy updated = new Occupancy(tenantId, unitId, startDate, endDate);
                    return occupancyRepository.save(updated);
                });
    }

    public void delete(String id) {
        occupancyRepository.findById(Identifier.from(id))
                .ifPresent(occupancyRepository::delete);
    }
}
