package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDeviceDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IMeasuringDeviceReadingService {
    List<MeasuringDeviceReading> findAll();

    Optional<MeasuringDeviceReading> findById(String measuringDeviceReadingId);

    Optional<MeasuringDeviceReading> findByMonthAndYear(String month, String year);

    void create(MeasuringDeviceReadingDTO measuringDeviceReadingDTO) throws BadRequestException;

    void addMeasuringDeviceReadingToMDevice(MeasuringDeviceReadingDeviceDTO measuringDeviceReadingDeviceDTO)
            throws BadRequestException;

    void deleteMeasuringDeviceReadingFromMDevice(MeasuringDeviceReadingDeviceDTO measuringDeviceReadingDeviceDTO);

    void update(String measuringDeviceReadingId, MeasuringDeviceReadingDTO measuringDeviceReadingDTO)
            throws BadRequestException;
}
