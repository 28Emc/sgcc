package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMeasuringDeviceReadingRepository extends JpaRepository<MeasuringDeviceReading, Long> {
    List<MeasuringDeviceReading> findByMeasuringDeviceId(Long measuringDeviceId);

    Optional<MeasuringDeviceReading> findByMeasuringDeviceIdAndMonthAndYear(Long measuringDeviceId,
                                                                            String month, String year);
}
