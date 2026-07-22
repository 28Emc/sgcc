package com.sgcc.settlement.infrastructure;

import com.sgcc.settlement.domain.Settlement;
import com.sgcc.settlement.domain.SettlementRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SettlementJpaRepository extends JpaRepository<Settlement, String> {

    List<Settlement> findByReceiptId(String receiptId);

    List<Settlement> findByTenantId(String tenantId);
}
