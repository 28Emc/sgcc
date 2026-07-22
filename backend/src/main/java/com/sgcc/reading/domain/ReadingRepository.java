package com.sgcc.reading.domain;

import com.sgcc.shared.domain.Identifier;
import com.sgcc.shared.domain.Repository;
import java.util.List;
import java.util.Optional;

public interface ReadingRepository extends Repository<Reading> {

    List<Reading> findByMeterId(String meterId);

    Optional<Reading> findLastReadingByMeterId(String meterId);
}
