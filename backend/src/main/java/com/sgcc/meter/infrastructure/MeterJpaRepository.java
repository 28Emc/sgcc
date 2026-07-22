package com.sgcc.meter.infrastructure;

import com.sgcc.meter.domain.Meter;
import com.sgcc.meter.domain.MeterRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MeterJpaRepository extends JpaRepository<Meter, String> {

    List<Meter> findByUnitId(String unitId);

    List<Meter> findByServiceId(String serviceId);

    Optional<Meter> findBySerialNumber(String serialNumber);
}
