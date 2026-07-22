package com.sgcc.property.infrastructure;

import com.sgcc.property.domain.Property;
import com.sgcc.property.domain.PropertyRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class PropertyRepositoryAdapter implements PropertyRepository {

    private final PropertyJpaRepository repository;

    public PropertyRepositoryAdapter(PropertyJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Property> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Property> findAll() {
        return repository.findAll();
    }

    @Override
    public Property save(Property entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Property entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Property> findByNameContaining(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}
