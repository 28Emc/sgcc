package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.Repository;
import java.util.List;

public interface SettlementRepository extends Repository<Settlement> {

    List<Settlement> findByReceiptId(String receiptId);

    List<Settlement> findByTenantId(String tenantId);
}
