package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IMeasuringDeviceService {
    List<MeasuringDevice> findAll();

    List<MeasuringDevice> findByType(String type);

    List<MeasuringDevice> findByRoomId(Long roomId);

    Optional<MeasuringDevice> findById(Long measuringDeviceId);

    Optional<MeasuringDevice> findByCode(String code);

    void create(MeasuringDeviceDTO measuringDeviceDTO) throws BadRequestException;

    void update(Long measuringDeviceId, MeasuringDeviceDTO measuringDeviceDTO);
}
