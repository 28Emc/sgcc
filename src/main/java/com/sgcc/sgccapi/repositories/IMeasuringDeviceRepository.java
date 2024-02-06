package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMeasuringDeviceRepository extends MongoRepository<MeasuringDevice, String> {
    Optional<MeasuringDevice> findByCode(String code);

    List<MeasuringDevice> findByType(String type);
}
