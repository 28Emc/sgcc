package com.sgcc.service.infrastructure;

import com.sgcc.service.domain.Service;
import com.sgcc.service.domain.ServiceRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class ServiceRepositoryAdapter implements ServiceRepository {

    private final ServiceJpaRepository repository;

    public ServiceRepositoryAdapter(ServiceJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Service> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Service> findAll() {
        return repository.findAll();
    }

    @Override
    public Service save(Service entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Service entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }
}
