package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.RoomDTO;
import com.sgcc.sgccapi.models.dtos.RoomTenantDTO;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.models.entities.Tenant;
import com.sgcc.sgccapi.repositories.IRoomRepository;
import com.sgcc.sgccapi.repositories.ITenantRepository;
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
public class RoomServiceImpl implements IRoomService {

    private final ITenantRepository tenantRepository;
    private final IRoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Room> findById(String roomId) {
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
        boolean foundRoom = roomRepository.findByRoomNumber(roomDTO.getRoomNumber()).isPresent();
        if (foundRoom) {
            throw new BadRequestException("Room already exists");
        }
        Room createdRoom = Room.builder()
                .roomNumber(roomDTO.getRoomNumber())
                .measuringDeviceList(List.of())
                .build();
        roomRepository.save(createdRoom);
    }

    @Override
    @Transactional
    public void addRoomToTenant(RoomTenantDTO roomTenantDTO) throws BadRequestException {
        Tenant foundTenant = tenantRepository.findById(roomTenantDTO.getTenantId())
                .orElseThrow(() -> new NoSuchElementException("Tenant not found"));
        Room foundRoom = findById(roomTenantDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        List<Room> foundRooms = foundTenant.getRoomList();
        if (foundRooms == null || foundRooms.isEmpty()) {
            foundRooms = new ArrayList<>();
        }
        boolean alreadyAddedRoom = foundRooms.stream()
                .anyMatch(room -> room.getId().equals(foundRoom.getId()));
        if (alreadyAddedRoom) {
            throw new BadRequestException("Room already added to tenant");
        }
        foundRooms.add(foundRoom);
        foundTenant.setRoomList(foundRooms);
        tenantRepository.save(foundTenant);
    }

    @Override
    @Transactional
    public void deleteRoomFromTenant(RoomTenantDTO roomTenantDTO) {
        Tenant foundTenant = tenantRepository.findById(roomTenantDTO.getTenantId())
                .orElseThrow(() -> new NoSuchElementException("Tenant not found"));
        Room foundRoom = findById(roomTenantDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        List<Room> foundRooms = foundTenant.getRoomList();
        foundRooms.removeIf(room -> room.getId().equals(foundRoom.getId()));
        foundTenant.setRoomList(foundRooms);
        tenantRepository.save(foundTenant);
    }

    @Override
    @Transactional
    public void update(String roomId, RoomDTO roomDTO) {
        Room foundRoom = findById(roomId)
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        foundRoom.setRoomNumber(roomDTO.getRoomNumber());
        roomRepository.save(foundRoom);
    }
}
