package com.sgcc.sgccapi.repositories;

import com.sgcc.sgccapi.models.entities.Housing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IHousingRepository extends JpaRepository<Housing, Long> {
    Optional<Housing> findByAddressIgnoreCase(String address);
}
