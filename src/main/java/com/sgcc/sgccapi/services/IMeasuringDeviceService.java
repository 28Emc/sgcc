package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceRoomDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IMeasuringDeviceService {
    List<MeasuringDevice> findAll();

    List<MeasuringDevice> findByType(String type);

    Optional<MeasuringDevice> findById(String measuringDeviceId);

    Optional<MeasuringDevice> findByCode(String code);

    void create(MeasuringDeviceDTO measuringDeviceDTO) throws BadRequestException;

    void addMeasuringDeviceToRoom(MeasuringDeviceRoomDTO measuringDeviceRoomDTO) throws BadRequestException;

    void deleteMeasuringDeviceFromRoom(MeasuringDeviceRoomDTO measuringDeviceRoomDTO);

    void update(String measuringDeviceId, MeasuringDeviceDTO measuringDeviceDTO);
}
