package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.TenantDTO;
import com.sgcc.sgccapi.models.entities.Tenant;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface ITenantService {
    List<Tenant> findAll();

    Optional<Tenant> findByRoomId(Long roomId);

    Optional<Tenant> findById(Long tenantId);

    Optional<Tenant> findByDocNumber(String docNumber);

    Optional<Tenant> findByFullName(String fullName);

    void create(TenantDTO tenantDTO) throws BadRequestException;

    void update(Long tenantId, TenantDTO tenantDTO);
}
