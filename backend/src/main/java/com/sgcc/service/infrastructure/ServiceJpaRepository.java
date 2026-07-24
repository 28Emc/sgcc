package com.sgcc.service.infrastructure;

import com.sgcc.service.domain.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceJpaRepository extends JpaRepository<Service, String> {
}
