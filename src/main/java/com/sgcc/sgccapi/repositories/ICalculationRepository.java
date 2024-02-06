package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Calculation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICalculationRepository extends MongoRepository<Calculation, String> {
    Optional<Calculation> findByMonthAndYear(String monthNumber, String yearNumber);
}
