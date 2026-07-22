package com.sgcc.receipt.infrastructure;

import com.sgcc.receipt.domain.Receipt;
import com.sgcc.receipt.domain.ReceiptRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class ReceiptRepositoryAdapter implements ReceiptRepository {

    private final ReceiptJpaRepository repository;

    public ReceiptRepositoryAdapter(ReceiptJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<Receipt> findById(Identifier id) {
        return repository.findById(id.getValue());
    }

    @Override
    public List<Receipt> findAll() {
        return repository.findAll();
    }

    @Override
    public Receipt save(Receipt entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Receipt entity) {
        repository.delete(entity);
    }

    @Override
    public boolean existsById(Identifier id) {
        return repository.existsById(id.getValue());
    }

    @Override
    public List<Receipt> findByServiceId(String serviceId) {
        return repository.findByServiceId(serviceId);
    }

    @Override
    public List<Receipt> findByPeriod(String period) {
        return repository.findByPeriod(period);
    }

    @Override
    public Optional<Receipt> findByReceiptNumber(String receiptNumber) {
        return repository.findByReceiptNumber(receiptNumber);
    }
}
