package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceRepository;
import com.sgcc.sgccapi.repositories.IRoomRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MeasuringDeviceServiceImpl implements IMeasuringDeviceService {
    private final IRoomRepository roomRepository;
    private final IMeasuringDeviceRepository measuringDeviceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDevice> findAll() {
        return measuringDeviceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDevice> findByType(String type) {
        return measuringDeviceRepository.findByType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDevice> findByRoomId(Long roomId) {
        return measuringDeviceRepository.findByRoomId(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDevice> findById(Long measuringDeviceId) {
        return measuringDeviceRepository.findById(measuringDeviceId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDevice> findByCode(String code) {
        return measuringDeviceRepository.findByCode(code);
    }

    @Override
    @Transactional
    public void create(MeasuringDeviceDTO measuringDeviceDTO) throws BadRequestException {
        Room foundRoom = roomRepository.findById(measuringDeviceDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        boolean foundMeasuringDevice = measuringDeviceRepository
                .findByCode(measuringDeviceDTO.getCode())
                .isPresent();
        if (foundMeasuringDevice) {
            throw new BadRequestException("Measuring device already exists");
        }
        MeasuringDevice createdMeasuringDevice = MeasuringDevice.builder()
                .room(foundRoom)
                .type(measuringDeviceDTO.getType())
                .code(measuringDeviceDTO.getCode())
                .build();
        measuringDeviceRepository.save(createdMeasuringDevice);
    }

    @Override
    @Transactional
    public void update(Long measuringDeviceId, MeasuringDeviceDTO measuringDeviceDTO) {
        Room foundRoom = roomRepository.findById(measuringDeviceDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        MeasuringDevice foundMeasuringDevice = findById(measuringDeviceId)
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        foundMeasuringDevice.setRoom(foundRoom);
        foundMeasuringDevice.setType(measuringDeviceDTO.getType());
        foundMeasuringDevice.setCode(measuringDeviceDTO.getCode());
        measuringDeviceRepository.save(foundMeasuringDevice);
    }
}
