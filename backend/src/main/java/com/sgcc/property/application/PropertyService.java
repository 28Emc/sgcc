package com.sgcc.property.application;

import com.sgcc.property.domain.Property;
import com.sgcc.property.domain.PropertyRepository;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Transactional(readOnly = true)
    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Property> findById(String id) {
        return propertyRepository.findById(Identifier.from(id));
    }

    public Property create(String name, String address, String description) {
        Property property = new Property(name, address, description);
        return propertyRepository.save(property);
    }

    public Optional<Property> update(String id, String name, String address, String description) {
        return propertyRepository.findById(Identifier.from(id))
                .map(property -> {
                    property.update(name, address, description);
                    return propertyRepository.save(property);
                });
    }

    public void delete(String id) {
        propertyRepository.findById(Identifier.from(id))
                .ifPresent(propertyRepository::delete);
    }
}
