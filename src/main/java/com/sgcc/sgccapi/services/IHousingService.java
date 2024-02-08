package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.HousingDTO;
import com.sgcc.sgccapi.models.entities.Housing;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IHousingService {
    List<Housing> findAll();

    Optional<Housing> findById(Long housingId);

    Optional<Housing> findByAddress(String address);

    void create(HousingDTO housingDTO) throws BadRequestException;

    void update(Long housingId, HousingDTO housingDTO);
}
