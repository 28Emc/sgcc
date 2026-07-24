package com.sgcc.tenant.application;

import com.sgcc.occupancy.infrastructure.OccupancyJpaRepository;
import com.sgcc.shared.domain.Identifier;
import com.sgcc.shared.domain.Status;
import com.sgcc.tenant.domain.Tenant;
import com.sgcc.tenant.domain.TenantRepository;
import com.sgcc.unit.infrastructure.UnitJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;
    private final OccupancyJpaRepository occupancyJpaRepository;
    private final UnitJpaRepository unitJpaRepository;

    public TenantService(TenantRepository tenantRepository,
                         OccupancyJpaRepository occupancyJpaRepository,
                         UnitJpaRepository unitJpaRepository) {
        this.tenantRepository = tenantRepository;
        this.occupancyJpaRepository = occupancyJpaRepository;
        this.unitJpaRepository = unitJpaRepository;
    }

    @Transactional(readOnly = true)
    public List<TenantListResponse> findAll() {
        return tenantRepository.findAll().stream()
                .map(tenant -> {
                    String unitName = occupancyJpaRepository.findByTenantIdAndStatus(tenant.getId(), Status.ACTIVE)
                            .flatMap(occupancy -> unitJpaRepository.findById(occupancy.getUnitId()))
                            .map(unit -> unit.getName())
                            .orElse(null);
                    return new TenantListResponse(
                            tenant.getId(),
                            tenant.getName(),
                            tenant.getDocumentNumber(),
                            tenant.getPhone(),
                            tenant.getEmail(),
                            tenant.getStatus().name(),
                            unitName
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Tenant> findById(String id) {
        return tenantRepository.findById(Identifier.from(id));
    }

    public Tenant create(String name, String documentNumber, String phone, String email) {
        Tenant tenant = new Tenant(name, documentNumber, phone, email);
        return tenantRepository.save(tenant);
    }

    public Optional<Tenant> update(String id, String name, String phone, String email) {
        return tenantRepository.findById(Identifier.from(id))
                .map(tenant -> {
                    tenant.update(name, phone, email);
                    return tenantRepository.save(tenant);
                });
    }

    public void delete(String id) {
        tenantRepository.findById(Identifier.from(id))
                .ifPresent(tenantRepository::delete);
    }

    public record TenantListResponse(
            String id,
            String name,
            String documentNumber,
            String phone,
            String email,
            String status,
            String unitName
    ) {}
}
