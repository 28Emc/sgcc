package com.sgcc.property.domain;

import com.sgcc.shared.domain.Repository;
import java.util.List;

public interface PropertyRepository extends Repository<Property> {

    List<Property> findByNameContaining(String name);
}
