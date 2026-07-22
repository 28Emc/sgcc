package com.sgcc.meter.domain;

import com.sgcc.shared.domain.Repository;
import java.util.List;
import java.util.Optional;

public interface MeterRepository extends Repository<Meter> {

    List<Meter> findByUnitId(String unitId);

    List<Meter> findByServiceId(String serviceId);

    Optional<Meter> findBySerialNumber(String serialNumber);
}
