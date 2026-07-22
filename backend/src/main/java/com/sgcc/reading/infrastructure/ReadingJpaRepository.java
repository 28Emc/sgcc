package com.sgcc.reading.infrastructure;

import com.sgcc.reading.domain.Reading;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReadingJpaRepository extends JpaRepository<Reading, String> {

    List<Reading> findByMeterIdOrderByReadingDateDesc(String meterId);

    @Query("SELECT r FROM Reading r WHERE r.meterId = :meterId ORDER BY r.readingDate DESC")
    List<Reading> findLastReadingByMeterId(@Param("meterId") String meterId, PageRequest pageRequest);

    default Optional<Reading> findTopReadingByMeterId(String meterId) {
        List<Reading> results = findLastReadingByMeterId(meterId, PageRequest.of(0, 1));
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
}
