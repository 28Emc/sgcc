package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMeasuringDeviceRepository extends JpaRepository<MeasuringDevice, Long> {
    Optional<MeasuringDevice> findByCode(String code);

    List<MeasuringDevice> findByType(String type);

    List<MeasuringDevice> findByRoomId(Long roomId);
}
