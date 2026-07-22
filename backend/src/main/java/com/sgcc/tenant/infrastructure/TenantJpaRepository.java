package com.sgcc.tenant.infrastructure;

import com.sgcc.tenant.domain.Tenant;
import com.sgcc.tenant.domain.TenantRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantJpaRepository extends JpaRepository<Tenant, String> {

    Optional<Tenant> findByDocumentNumber(String documentNumber);

    List<Tenant> findByNameContainingIgnoreCase(String name);
}
