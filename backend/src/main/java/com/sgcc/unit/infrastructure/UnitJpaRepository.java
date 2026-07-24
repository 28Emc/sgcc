package com.sgcc.unit.infrastructure;

import com.sgcc.property.domain.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnitJpaRepository extends JpaRepository<Unit, String> {
    List<Unit> findByPropertyId(String propertyId);
}
