package com.sgcc.settlement.infrastructure;

import com.sgcc.settlement.domain.Settlement;
import com.sgcc.settlement.domain.SettlementRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class SettlementRepositoryAdapter implements SettlementRepository {

    private final SettlementJpaRepository repository;

    public SettlementRepositoryAdapter(SettlementJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Settlement> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Settlement> findAll() {
        return repository.findAll();
    }

    @Override
    public Settlement save(Settlement entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Settlement entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Settlement> findByReceiptId(String receiptId) {
        return repository.findByReceiptId(receiptId);
    }

    @Override
    public List<Settlement> findByTenantId(String tenantId) {
        return repository.findByTenantId(tenantId);
    }
}
