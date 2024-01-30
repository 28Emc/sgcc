package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Tenant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITenantRepository extends MongoRepository<Tenant, String> {
    Optional<Tenant> findByDocNumber(String docNumber);
    Optional<Tenant> findByFullNameIgnoreCase(String fullName);
}
