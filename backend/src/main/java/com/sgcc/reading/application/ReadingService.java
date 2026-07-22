package com.sgcc.reading.application;

import com.sgcc.reading.domain.Reading;
import com.sgcc.reading.domain.ReadingRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReadingService {

    private final ReadingRepository readingRepository;

    public ReadingService(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    @Transactional(readOnly = true)
    public List<Reading> findAll() {
        return readingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Reading> findById(String id) {
        return readingRepository.findById(Identifier.from(id));
    }

    public Reading create(String meterId, LocalDate readingDate, BigDecimal readingValue) {
        Reading reading = new Reading(meterId, readingDate, readingValue);
        return readingRepository.save(reading);
    }

    @Transactional(readOnly = true)
    public Optional<BigDecimal> calculateConsumption(String meterId) {
        List<Reading> readings = readingRepository.findByMeterId(meterId);
        if (readings.size() < 2) {
            return Optional.empty();
        }
        Reading current = readings.get(0);
        Reading previous = readings.get(1);
        return Optional.of(current.calculateConsumption(previous.getReadingValue()));
    }
}
