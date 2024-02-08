package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Receipt;
import com.sgcc.sgccapi.models.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByYear(String yearNumber);

    Optional<Receipt> findByMonth(String monthNumber);

    Optional<Receipt> findByMonthAndYear(String monthNumber, String yearNumber);

    List<Receipt> findByHousingId(Long housingId);
}
