package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.TenantDTO;
import com.sgcc.sgccapi.models.entities.Tenant;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface ITenantService {
    List<Tenant> findAll();

    Optional<Tenant> findById(String tenantId);

    Optional<Tenant> findByDocNumber(String docNumber);

    Optional<Tenant> findByFullName(String fullName);

    void create(TenantDTO tenantDTO) throws BadRequestException;

    void update(String tenantId, TenantDTO tenantDTO);
}
