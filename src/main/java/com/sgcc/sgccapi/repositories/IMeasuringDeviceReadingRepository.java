package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IMeasuringDeviceReadingRepository extends MongoRepository<MeasuringDeviceReading, String> {
    Optional<MeasuringDeviceReading> findByMonthAndYear(String month, String year);
}
