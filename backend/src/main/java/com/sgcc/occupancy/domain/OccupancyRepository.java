package com.sgcc.occupancy.domain;

import com.sgcc.shared.domain.Repository;
import com.sgcc.shared.domain.Status;
import java.util.List;
import java.util.Optional;

public interface OccupancyRepository extends Repository<Occupancy> {

    List<Occupancy> findByUnitIdAndStatus(String unitId, Status status);

    Optional<Occupancy> findByTenantIdAndStatus(String tenantId, Status status);

    List<Occupancy> findByTenantId(String tenantId);
}
