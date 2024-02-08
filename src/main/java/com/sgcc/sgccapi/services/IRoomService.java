package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.RoomDTO;
import com.sgcc.sgccapi.models.dtos.RoomTenantDTO;
import com.sgcc.sgccapi.models.entities.Room;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IRoomService {
    List<Room> findAll();

    List<Room> findByHousingId(Long housingId);

    Optional<Room> findById(Long roomId);

    Optional<Room> findByRoomNumber(String roomNumber);

    void create(RoomDTO roomDTO) throws BadRequestException;

    void update(Long roomId, RoomDTO roomDTO);
}
