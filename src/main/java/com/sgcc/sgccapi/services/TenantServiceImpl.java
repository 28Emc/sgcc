package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.TenantDTO;
import com.sgcc.sgccapi.models.entities.Tenant;
import com.sgcc.sgccapi.repositories.ITenantRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TenantServiceImpl implements ITenantService {
    private final ITenantRepository tenantRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Tenant> findAll() {
        return tenantRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findById(String tenantId) {
        return tenantRepository.findById(tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findByDocNumber(String docNumber) {
        return tenantRepository.findByDocNumber(docNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findByFullName(String fullName) {
        return tenantRepository.findByFullNameIgnoreCase(fullName);
    }

    @Override
    @Transactional
    public void create(TenantDTO tenantDTO) throws BadRequestException {
        boolean foundTenant = findByDocNumber(tenantDTO.getDocNumber()).isPresent();
        if (foundTenant) {
            throw new BadRequestException("Tenant already exists");
        }
        tenantRepository.save(Tenant.builder()
                .fullName(tenantDTO.getFullName())
                .docNumber(tenantDTO.getDocNumber())
                .roomList(List.of())
                .build());
    }

    @Override
    @Transactional
    public void update(String tenantId, TenantDTO tenantDTO) {
        Tenant foundTenant = findById(tenantId)
                .orElseThrow(() -> new NoSuchElementException("Tenant not found"));
        foundTenant.setFullName(tenantDTO.getFullName().trim());
        foundTenant.setDocNumber(tenantDTO.getDocNumber());
        tenantRepository.save(foundTenant);
    }
}
