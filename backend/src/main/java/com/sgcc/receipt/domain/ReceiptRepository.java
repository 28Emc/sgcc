package com.sgcc.receipt.domain;

import com.sgcc.shared.domain.Repository;
import java.util.List;
import java.util.Optional;

public interface ReceiptRepository extends Repository<Receipt> {

    List<Receipt> findByServiceId(String serviceId);

    List<Receipt> findByPeriod(String period);

    Optional<Receipt> findByReceiptNumber(String receiptNumber);
}
