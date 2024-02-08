package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.RoomDTO;
import com.sgcc.sgccapi.models.entities.Housing;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.repositories.IHousingRepository;
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
public class RoomServiceImpl implements IRoomService {
    private final IHousingRepository housingRepository;
    private final IRoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> findByHousingId(Long housingId) {
        return roomRepository.findByHousingId(housingId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Room> findById(Long roomId) {
        return roomRepository.findById(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Room> findByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    @Override
    @Transactional
    public void create(RoomDTO roomDTO) throws BadRequestException {
        Housing foundHousing = housingRepository.findById(roomDTO.getHousingId())
                .orElseThrow(() -> new NoSuchElementException("Housing not found"));
        boolean foundRoom = roomRepository.findByRoomNumber(roomDTO.getRoomNumber()).isPresent();
        if (foundRoom) {
            throw new BadRequestException("Room already exists");
        }
        Room createdRoom = Room.builder()
                .housing(foundHousing)
                .roomNumber(roomDTO.getRoomNumber())
                .build();
        roomRepository.save(createdRoom);
    }

    @Override
    @Transactional
    public void update(Long roomId, RoomDTO roomDTO) {
        Room foundRoom = findById(roomId)
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        Housing foundHousing = housingRepository.findById(roomDTO.getHousingId())
                .orElseThrow(() -> new NoSuchElementException("Housing not found"));
        foundRoom.setHousing(foundHousing);
        foundRoom.setRoomNumber(roomDTO.getRoomNumber());
        roomRepository.save(foundRoom);
    }
}
