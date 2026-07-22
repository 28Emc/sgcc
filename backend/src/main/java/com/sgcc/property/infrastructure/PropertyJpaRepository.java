package com.sgcc.property.infrastructure;

import com.sgcc.property.domain.Property;
import com.sgcc.property.domain.PropertyRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyJpaRepository extends JpaRepository<Property, String> {

    List<Property> findByNameContainingIgnoreCase(String name);
}
