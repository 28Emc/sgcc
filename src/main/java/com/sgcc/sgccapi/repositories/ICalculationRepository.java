package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Calculation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByMeasuringDeviceReadingIdAndYear(Long measuringDeviceReadingId, String year);

    List<Calculation> findByMeasuringDeviceReadingIdAndMonth(Long measuringDeviceReadingId, String month);

    Optional<Calculation> findByMeasuringDeviceReadingIdAndMonthAndYear(Long measuringDeviceReadingId, String month,
                                                                        String year);
}
