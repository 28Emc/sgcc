package com.sgcc.occupancy.infrastructure;

import com.sgcc.occupancy.domain.Occupancy;
import com.sgcc.shared.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OccupancyJpaRepository extends JpaRepository<Occupancy, String> {
    List<Occupancy> findByUnitIdAndStatus(String unitId, Status status);
    Optional<Occupancy> findByTenantIdAndStatus(String tenantId, Status status);
    List<Occupancy> findByTenantId(String tenantId);
}
