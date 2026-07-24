package com.sgcc.receipt.application;

import com.sgcc.receipt.domain.Receipt;
import com.sgcc.receipt.domain.ReceiptRepository;
import com.sgcc.service.infrastructure.ServiceJpaRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ServiceJpaRepository serviceJpaRepository;

    public ReceiptService(ReceiptRepository receiptRepository, ServiceJpaRepository serviceJpaRepository) {
        this.receiptRepository = receiptRepository;
        this.serviceJpaRepository = serviceJpaRepository;
    }

    @Transactional(readOnly = true)
    public List<ReceiptListResponse> findAll() {
        return receiptRepository.findAll().stream()
                .map(receipt -> {
                    String serviceName = serviceJpaRepository.findById(receipt.getServiceId())
                            .map(com.sgcc.service.domain.Service::getName)
                            .orElse(null);
                    return new ReceiptListResponse(
                            receipt.getId(),
                            receipt.getServiceId(),
                            receipt.getPeriod(),
                            receipt.getReceiptNumber(),
                            receipt.getTotalAmount(),
                            receipt.getTotalConsumption(),
                            serviceName
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Receipt> findById(String id) {
        return receiptRepository.findById(Identifier.from(id));
    }

    public Receipt create(String serviceId, String period, String receiptNumber,
                         BigDecimal totalAmount, BigDecimal totalConsumption) {
        Receipt receipt = new Receipt(serviceId, period, receiptNumber,
                                      totalAmount, totalConsumption);
        return receiptRepository.save(receipt);
    }

    public Optional<Receipt> update(String id, String period, BigDecimal totalAmount, BigDecimal totalConsumption) {
        return receiptRepository.findById(Identifier.from(id))
                .map(receipt -> {
                    receipt.update(period, totalAmount, totalConsumption);
                    return receiptRepository.save(receipt);
                });
    }

    public void delete(String id) {
        receiptRepository.findById(Identifier.from(id))
                .ifPresent(receiptRepository::delete);
    }

    public record ReceiptListResponse(
            String id,
            String serviceId,
            String period,
            String receiptNumber,
            BigDecimal totalAmount,
            BigDecimal totalConsumption,
            String serviceName
    ) {}
}
