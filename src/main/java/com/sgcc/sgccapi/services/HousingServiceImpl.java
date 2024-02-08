package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.HousingDTO;
import com.sgcc.sgccapi.models.entities.Housing;
import com.sgcc.sgccapi.repositories.IHousingRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HousingServiceImpl implements IHousingService {
    private final IHousingRepository housingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Housing> findAll() {
        return housingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Housing> findById(Long housingId) {
        return housingRepository.findById(housingId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Housing> findByAddress(String address) {
        return housingRepository.findByAddressIgnoreCase(address);
    }

    @Override
    @Transactional
    public void create(HousingDTO housingDTO) throws BadRequestException {
        boolean foundHousing = findByAddress(housingDTO.getAddress()).isPresent();
        if (foundHousing) {
            throw new BadRequestException("Housing already exists");
        }
        Housing createdHousing = Housing.builder()
                .address(housingDTO.getAddress())
                .build();
        housingRepository.save(createdHousing);
    }

    @Override
    @Transactional
    public void update(Long housingId, HousingDTO housingDTO) {
        Housing foundHousing = findById(housingId)
                .orElseThrow(() -> new NoSuchElementException("Housing not found"));
        foundHousing.setAddress(housingDTO.getAddress());
        housingRepository.save(foundHousing);
    }
}
