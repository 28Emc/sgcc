package com.sgcc.tenant.application;

import com.sgcc.tenant.domain.Tenant;
import com.sgcc.tenant.domain.TenantRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Transactional(readOnly = true)
    public List<Tenant> findAll() {
        return tenantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Tenant> findById(String id) {
        return tenantRepository.findById(Identifier.from(id));
    }

    public Tenant create(String name, String documentNumber, String phone, String email) {
        Tenant tenant = new Tenant(name, documentNumber, phone, email);
        return tenantRepository.save(tenant);
    }
}
