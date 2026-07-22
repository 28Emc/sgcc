package com.sgcc.tenant.domain;

import com.sgcc.shared.domain.Repository;
import java.util.List;
import java.util.Optional;

public interface TenantRepository extends Repository<Tenant> {

    Optional<Tenant> findByDocumentNumber(String documentNumber);

    List<Tenant> findByNameContaining(String name);
}
