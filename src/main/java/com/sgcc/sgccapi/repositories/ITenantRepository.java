package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByDocNumber(String docNumber);

    Optional<Tenant> findByFullNameIgnoreCase(String fullName);

    Optional<Tenant> findByRoomId(Long roomId);
}
