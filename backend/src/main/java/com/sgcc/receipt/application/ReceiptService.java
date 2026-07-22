package com.sgcc.receipt.application;

import com.sgcc.receipt.domain.Receipt;
import com.sgcc.receipt.domain.ReceiptRepository;
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

    public ReceiptService(ReceiptRepository receiptRepository) {
        this.receiptRepository = receiptRepository;
    }

    @Transactional(readOnly = true)
    public List<Receipt> findAll() {
        return receiptRepository.findAll();
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
}
