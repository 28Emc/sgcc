package com.sgcc.receipt.infrastructure;

import com.sgcc.receipt.domain.Receipt;
import com.sgcc.receipt.domain.ReceiptRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReceiptJpaRepository extends JpaRepository<Receipt, String> {

    List<Receipt> findByServiceId(String serviceId);

    List<Receipt> findByPeriod(String period);

    Optional<Receipt> findByReceiptNumber(String receiptNumber);
}
