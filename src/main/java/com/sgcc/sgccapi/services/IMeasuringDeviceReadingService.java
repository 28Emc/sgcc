package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IMeasuringDeviceReadingService {
    List<MeasuringDeviceReading> findAll();

    List<MeasuringDeviceReading> findByMeasuringDeviceId(Long measuringDeviceId);

    Optional<MeasuringDeviceReading> findById(Long measuringDeviceReadingId);

    Optional<MeasuringDeviceReading> findByMeasuringDeviceIdAndMonthAndYear(Long measuringDeviceId,
                                                                            String month, String year);

    void create(MeasuringDeviceReadingDTO measuringDeviceReadingDTO) throws BadRequestException;

    void update(Long measuringDeviceReadingId, MeasuringDeviceReadingDTO measuringDeviceReadingDTO)
            throws BadRequestException;
}
