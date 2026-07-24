package com.sgcc.reading.application;

import com.sgcc.meter.domain.Meter;
import com.sgcc.meter.infrastructure.MeterJpaRepository;
import com.sgcc.occupancy.domain.Occupancy;
import com.sgcc.occupancy.infrastructure.OccupancyJpaRepository;
import com.sgcc.reading.domain.Reading;
import com.sgcc.reading.infrastructure.ReadingJpaRepository;
import com.sgcc.shared.domain.Status;
import com.sgcc.tenant.domain.Tenant;
import com.sgcc.tenant.infrastructure.TenantJpaRepository;
import com.sgcc.property.domain.Unit;
import com.sgcc.unit.infrastructure.UnitJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReadingService {

    private final ReadingJpaRepository readingJpaRepository;
    private final MeterJpaRepository meterJpaRepository;
    private final UnitJpaRepository unitJpaRepository;
    private final OccupancyJpaRepository occupancyJpaRepository;
    private final TenantJpaRepository tenantJpaRepository;

    public ReadingService(ReadingJpaRepository readingJpaRepository,
                          MeterJpaRepository meterJpaRepository,
                          UnitJpaRepository unitJpaRepository,
                          OccupancyJpaRepository occupancyJpaRepository,
                          TenantJpaRepository tenantJpaRepository) {
        this.readingJpaRepository = readingJpaRepository;
        this.meterJpaRepository = meterJpaRepository;
        this.unitJpaRepository = unitJpaRepository;
        this.occupancyJpaRepository = occupancyJpaRepository;
        this.tenantJpaRepository = tenantJpaRepository;
    }

    public record ReadingListResponse(
            String id,
            String meterId,
            LocalDate readingDate,
            BigDecimal readingValue,
            String meterSerial,
            String tenantName,
            String unitName,
            BigDecimal previousValue
    ) {}

    @Transactional(readOnly = true)
    public List<ReadingListResponse> findAll() {
        List<Reading> readings = readingJpaRepository.findAll();
        List<ReadingListResponse> responses = new ArrayList<>();

        for (Reading reading : readings) {
            String meterSerial = null;
            String tenantName = null;
            String unitName = null;
            BigDecimal previousValue = null;

            Optional<Meter> meterOpt = meterJpaRepository.findById(reading.getMeterId());
            if (meterOpt.isPresent()) {
                Meter meter = meterOpt.get();
                meterSerial = meter.getSerialNumber();

                Optional<Unit> unitOpt = unitJpaRepository.findById(meter.getUnitId());
                if (unitOpt.isPresent()) {
                    unitName = unitOpt.get().getName();

                    List<Occupancy> occupancies = occupancyJpaRepository.findByUnitIdAndStatus(
                            unitOpt.get().getId(), Status.ACTIVE);
                    if (!occupancies.isEmpty()) {
                        Occupancy occupancy = occupancies.get(0);
                        Optional<Tenant> tenantOpt = tenantJpaRepository.findById(occupancy.getTenantId());
                        if (tenantOpt.isPresent()) {
                            tenantName = tenantOpt.get().getName();
                        }
                    }
                }
            }

            List<Reading> meterReadings = readingJpaRepository.findByMeterIdOrderByReadingDateDesc(
                    reading.getMeterId());
            if (meterReadings.size() >= 2) {
                for (int i = 0; i < meterReadings.size(); i++) {
                    if (meterReadings.get(i).getId().equals(reading.getId())) {
                        if (i + 1 < meterReadings.size()) {
                            previousValue = meterReadings.get(i + 1).getReadingValue();
                        }
                        break;
                    }
                }
            }

            responses.add(new ReadingListResponse(
                    reading.getId(),
                    reading.getMeterId(),
                    reading.getReadingDate(),
                    reading.getReadingValue(),
                    meterSerial,
                    tenantName,
                    unitName,
                    previousValue
            ));
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public Optional<Reading> findById(String id) {
        return readingJpaRepository.findById(id);
    }

    public Reading create(String meterId, LocalDate readingDate, BigDecimal readingValue) {
        Reading reading = new Reading(meterId, readingDate, readingValue);
        return readingJpaRepository.save(reading);
    }

    public Optional<Reading> update(String id, LocalDate readingDate, BigDecimal readingValue) {
        return readingJpaRepository.findById(id)
                .map(reading -> {
                    reading.update(readingDate, readingValue);
                    return readingJpaRepository.save(reading);
                });
    }

    public void delete(String id) {
        readingJpaRepository.findById(id)
                .ifPresent(readingJpaRepository::delete);
    }

    @Transactional(readOnly = true)
    public Optional<BigDecimal> calculateConsumption(String meterId) {
        List<Reading> readings = readingJpaRepository.findByMeterIdOrderByReadingDateDesc(meterId);
        if (readings.size() < 2) {
            return Optional.empty();
        }
        Reading current = readings.get(0);
        Reading previous = readings.get(1);
        return Optional.of(current.calculateConsumption(previous.getReadingValue()));
    }
}
