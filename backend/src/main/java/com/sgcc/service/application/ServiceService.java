package com.sgcc.service.application;

import com.sgcc.service.domain.ServiceRepository;
import com.sgcc.shared.domain.Identifier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Component
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<com.sgcc.service.domain.Service> findAll() {
        return serviceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<com.sgcc.service.domain.Service> findById(String id) {
        return serviceRepository.findById(Identifier.from(id));
    }

    public com.sgcc.service.domain.Service create(String name, String measurementUnit) {
        com.sgcc.service.domain.Service service = new com.sgcc.service.domain.Service(name, measurementUnit);
        return serviceRepository.save(service);
    }

    public Optional<com.sgcc.service.domain.Service> update(String id, String name, String measurementUnit) {
        return serviceRepository.findById(Identifier.from(id))
                .map(existing -> {
                    com.sgcc.service.domain.Service updated = new com.sgcc.service.domain.Service(name, measurementUnit);
                    return serviceRepository.save(updated);
                });
    }

    public void delete(String id) {
        serviceRepository.findById(Identifier.from(id))
                .ifPresent(serviceRepository::delete);
    }
}
