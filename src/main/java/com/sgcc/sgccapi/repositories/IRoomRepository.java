package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoomRepository extends MongoRepository<Room, String> {
    Optional<Room> findByRoomNumber(String roomNumber);
}
