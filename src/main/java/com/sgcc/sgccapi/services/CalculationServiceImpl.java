package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.repositories.ICalculationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CalculationServiceImpl implements ICalculationService {
    private final ICalculationRepository calculationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Calculation> findAll() {
        return calculationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Calculation> findByMeasuringDeviceReadingIdAndYear(Long measuringDeviceReadingId, String year) {
        return calculationRepository.findByMeasuringDeviceReadingIdAndYear(measuringDeviceReadingId, year);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Calculation> findByMeasuringDeviceReadingIdAndMonth(Long measuringDeviceReadingId, String month) {
        return calculationRepository.findByMeasuringDeviceReadingIdAndMonth(measuringDeviceReadingId, month);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Calculation> findByMeasuringDeviceReadingIdAndMonthAndYear(Long measuringDeviceReadingId,
                                                                               String month, String year) {
        return calculationRepository.findByMeasuringDeviceReadingIdAndMonthAndYear(measuringDeviceReadingId,
                month, year);
    }
}
