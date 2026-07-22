package com.sgcc.reading.infrastructure;

import com.sgcc.reading.domain.Reading;
import com.sgcc.reading.domain.ReadingRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class ReadingRepositoryAdapter implements ReadingRepository {

    private final ReadingJpaRepository repository;

    public ReadingRepositoryAdapter(ReadingJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Reading> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Reading> findAll() {
        return repository.findAll();
    }

    @Override
    public Reading save(Reading entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Reading entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Reading> findByMeterId(String meterId) {
        return repository.findByMeterIdOrderByReadingDateDesc(meterId);
    }

    @Override
    public Optional<Reading> findLastReadingByMeterId(String meterId) {
        return repository.findTopReadingByMeterId(meterId);
    }
}
