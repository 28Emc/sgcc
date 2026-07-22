package com.sgcc.tenant.infrastructure;

import com.sgcc.tenant.domain.Tenant;
import com.sgcc.tenant.domain.TenantRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class TenantRepositoryAdapter implements TenantRepository {

    private final TenantJpaRepository repository;

    public TenantRepositoryAdapter(TenantJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Tenant> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Tenant> findAll() {
        return repository.findAll();
    }

    @Override
    public Tenant save(Tenant entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Tenant entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public Optional<Tenant> findByDocumentNumber(String documentNumber) {
        return repository.findByDocumentNumber(documentNumber);
    }

    @Override
    public List<Tenant> findByNameContaining(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}
