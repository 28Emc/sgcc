package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.TenantDTO;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.models.entities.Tenant;
import com.sgcc.sgccapi.repositories.IRoomRepository;
import com.sgcc.sgccapi.repositories.ITenantRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TenantServiceImpl implements ITenantService {
    private final ITenantRepository tenantRepository;
    private final IRoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Tenant> findAll() {
        return tenantRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findByRoomId(Long roomId) {
        return tenantRepository.findByRoomId(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findById(Long tenantId) {
        return tenantRepository.findById(tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findByDocNumber(String docNumber) {
        return tenantRepository.findByDocNumber(docNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tenant> findByFullName(String fullName) {
        return tenantRepository.findByFullNameIgnoreCase(fullName);
    }

    @Override
    @Transactional
    public void create(TenantDTO tenantDTO) throws BadRequestException {
        Room foundRoom = roomRepository.findById(tenantDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        boolean foundTenant = findByDocNumber(tenantDTO.getDocNumber()).isPresent();
        if (foundTenant) {
            throw new BadRequestException("Tenant already exists");
        }
        tenantRepository.save(Tenant.builder()
                .fullName(tenantDTO.getFullName())
                .docNumber(tenantDTO.getDocNumber())
                .room(foundRoom)
                .build());
    }

    @Override
    @Transactional
    public void update(Long tenantId, TenantDTO tenantDTO) {
        Room foundRoom = roomRepository.findById(tenantDTO.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Room not found"));
        Tenant foundTenant = findById(tenantId)
                .orElseThrow(() -> new NoSuchElementException("Tenant not found"));
        foundTenant.setRoom(foundRoom);
        foundTenant.setFullName(tenantDTO.getFullName().trim());
        foundTenant.setDocNumber(tenantDTO.getDocNumber());
        tenantRepository.save(foundTenant);
    }
}
