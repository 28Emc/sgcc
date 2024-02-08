package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.entities.Calculation;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ICalculationService {
    List<Calculation> findAll();

    // TODO: ADD CUSTOM QUERY TO FETCH ALL CALCULATIONS BY MEASURING DEVICE ID AND YEAR (EXAMPLE: 12 ITEMS)
    @Query(nativeQuery = true, value = "SELECT c.* FROM measuring_devices md" +
            " INNER JOIN measuring_device_readings mdr ON mdr.id = md.id" +
            " INNER JOIN calculations c ON c.measuring_device_reading_id = mdr.id" +
            " WHERE mdr.id = ?1 AND mdr.year = ?2")
    List<Calculation> findByMeasuringDeviceReadingIdAndYear(Long measuringDeviceReadingId, String year);

    // TODO: ADD CUSTOM QUERY TO FETCH ALL CALCULATIONS BY MEASURING DEVICE ID AND MONTH (EXAMPLE: 1 ITEM)
    @Query(nativeQuery = true, value = "SELECT c.* FROM measuring_devices md" +
            " INNER JOIN measuring_device_readings mdr ON mdr.id = md.id" +
            " INNER JOIN calculations c ON c.measuring_device_reading_id = mdr.id" +
            " WHERE mdr.id = ?1 AND mdr.month = ?2")
    List<Calculation> findByMeasuringDeviceReadingIdAndMonth(Long measuringDeviceReadingId, String month);

    Optional<Calculation> findByMeasuringDeviceReadingIdAndMonthAndYear(Long measuringDeviceReadingId, String month,
                                                                        String year);
}
