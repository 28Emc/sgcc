package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceRoomDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceRepository;
import com.sgcc.sgccapi.repositories.IRoomRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    public Optional<MeasuringDevice> findById(String measuringDeviceId) {
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
        boolean foundMeasuringDevice = measuringDeviceRepository
                .findByCode(measuringDeviceDTO.getCode())
                .isPresent();
        if (foundMeasuringDevice) {
            throw new BadRequestException("Measuring device already exists");
        }
        MeasuringDevice createdMeasuringDevice = MeasuringDevice.builder()
                .type(measuringDeviceDTO.getType())
                .code(measuringDeviceDTO.getCode())
                .measuringDeviceReadingList(List.of())
                .receiptList(List.of())
                .build();
        measuringDeviceRepository.save(createdMeasuringDevice);
    }

    @Override
    @Transactional
    public void addMeasuringDeviceToRoom(MeasuringDeviceRoomDTO measuringDeviceRoomDTO) throws BadRequestException {
        Room foundRoom = roomRepository.findById(measuringDeviceRoomDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceRoomDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        List<MeasuringDevice> foundMeasuringDevices = foundRoom.getMeasuringDeviceList();
        if (foundMeasuringDevices == null || foundMeasuringDevices.isEmpty()) {
            foundMeasuringDevices = new ArrayList<>();
        }
        boolean alreadyAddedMeasuringDevice = foundMeasuringDevices.stream()
                .anyMatch(measuringDevice -> measuringDevice.getId().equals(foundMeasuringDevice.getId()));
        if (alreadyAddedMeasuringDevice) {
            throw new BadRequestException("Measuring device already added to room");
        }
        foundMeasuringDevices.add(foundMeasuringDevice);
        foundRoom.setMeasuringDeviceList(foundMeasuringDevices);
        roomRepository.save(foundRoom);
    }

    @Override
    @Transactional
    public void deleteMeasuringDeviceFromRoom(MeasuringDeviceRoomDTO measuringDeviceRoomDTO) {
        Room foundRoom = roomRepository.findById(measuringDeviceRoomDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceRoomDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        List<MeasuringDevice> foundMeasuringDevices = foundRoom.getMeasuringDeviceList();
        foundMeasuringDevices
                .removeIf(measuringDevice -> measuringDevice.getId().equals(foundMeasuringDevice.getId()));
        foundRoom.setMeasuringDeviceList(foundMeasuringDevices);
        roomRepository.save(foundRoom);
    }

    @Override
    @Transactional
    public void update(String measuringDeviceId, MeasuringDeviceDTO measuringDeviceDTO) {
        MeasuringDevice foundMeasuringDevice = findById(measuringDeviceId)
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        foundMeasuringDevice.setType(measuringDeviceDTO.getType());
        foundMeasuringDevice.setCode(measuringDeviceDTO.getCode());
        measuringDeviceRepository.save(foundMeasuringDevice);
    }
}
