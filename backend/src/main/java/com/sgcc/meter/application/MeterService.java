package com.sgcc.meter.application;

import com.sgcc.meter.domain.Meter;
import com.sgcc.meter.domain.MeterRepository;
import com.sgcc.service.infrastructure.ServiceJpaRepository;
import com.sgcc.unit.infrastructure.UnitJpaRepository;
import com.sgcc.property.infrastructure.PropertyJpaRepository;
import com.sgcc.reading.infrastructure.ReadingJpaRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MeterService {

    private final MeterRepository meterRepository;
    private final ServiceJpaRepository serviceJpaRepository;
    private final UnitJpaRepository unitJpaRepository;
    private final PropertyJpaRepository propertyJpaRepository;
    private final ReadingJpaRepository readingJpaRepository;

    public MeterService(MeterRepository meterRepository,
                        ServiceJpaRepository serviceJpaRepository,
                        UnitJpaRepository unitJpaRepository,
                        PropertyJpaRepository propertyJpaRepository,
                        ReadingJpaRepository readingJpaRepository) {
        this.meterRepository = meterRepository;
        this.serviceJpaRepository = serviceJpaRepository;
        this.unitJpaRepository = unitJpaRepository;
        this.propertyJpaRepository = propertyJpaRepository;
        this.readingJpaRepository = readingJpaRepository;
    }

    @Transactional(readOnly = true)
    public List<MeterListResponse> findAll() {
        List<Meter> meters = meterRepository.findAll();
        return meters.stream()
                .map(this::toMeterListResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Meter> findById(String id) {
        return meterRepository.findById(Identifier.from(id));
    }

    public Meter create(String unitId, String serviceId, String serialNumber) {
        Meter meter = new Meter(unitId, serviceId, serialNumber);
        return meterRepository.save(meter);
    }

    public Optional<Meter> update(String id, String unitId, String serviceId, String serialNumber) {
        return meterRepository.findById(Identifier.from(id))
                .map(meter -> {
                    meter.update(unitId, serviceId, serialNumber);
                    return meterRepository.save(meter);
                });
    }

    public void delete(String id) {
        meterRepository.findById(Identifier.from(id))
                .ifPresent(meterRepository::delete);
    }

    private MeterListResponse toMeterListResponse(Meter meter) {
        var serviceOpt = serviceJpaRepository.findById(meter.getServiceId());
        String serviceName = serviceOpt.map(s -> s.getName()).orElse("N/A");
        String unitOfMeasure = serviceOpt.map(s -> s.getMeasurementUnit()).orElse("");

        var unitOpt = unitJpaRepository.findById(meter.getUnitId());
        String unitName = unitOpt.map(u -> u.getName()).orElse("N/A");

        String propertyName = unitOpt
                .flatMap(u -> propertyJpaRepository.findById(u.getPropertyId()))
                .map(p -> p.getName())
                .orElse("N/A");

        java.math.BigDecimal lastReadingValue = readingJpaRepository.findTopReadingByMeterId(meter.getId())
                .map(r -> r.getReadingValue())
                .orElse(null);

        return new MeterListResponse(
                meter.getId(),
                meter.getSerialNumber(),
                meter.getUnitId(),
                meter.getServiceId(),
                meter.getStatus().name(),
                serviceName,
                unitName,
                propertyName,
                lastReadingValue,
                unitOfMeasure
        );
    }

    public record MeterListResponse(
            String id,
            String serialNumber,
            String unitId,
            String serviceId,
            String status,
            String serviceName,
            String unitName,
            String propertyName,
            java.math.BigDecimal lastReadingValue,
            String unitOfMeasure
    ) {}
}
