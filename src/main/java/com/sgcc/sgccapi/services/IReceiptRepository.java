package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.entities.Receipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IReceiptRepository extends MongoRepository<Receipt, String> {
    List<Receipt> findByYear(String yearNumber);

    Optional<Receipt> findByMonth(String monthNumber);

    Optional<Receipt> findByMonthAndYear(String monthNumber, String yearNumber);
}
