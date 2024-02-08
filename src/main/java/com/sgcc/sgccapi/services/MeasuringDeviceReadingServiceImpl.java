package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDTO;
import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import com.sgcc.sgccapi.models.entities.Receipt;
import com.sgcc.sgccapi.repositories.ICalculationRepository;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceReadingRepository;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceRepository;
import com.sgcc.sgccapi.repositories.IReceiptRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static com.sgcc.sgccapi.utils.Utils.*;

@Service
@AllArgsConstructor
public class MeasuringDeviceReadingServiceImpl implements IMeasuringDeviceReadingService {
    private final IMeasuringDeviceReadingRepository measuringDeviceReadingRepository;
    private final IMeasuringDeviceRepository measuringDeviceRepository;
    private final ICalculationRepository calculationRepository;
    private final IReceiptRepository receiptRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDeviceReading> findAll() {
        return measuringDeviceReadingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDeviceReading> findByMeasuringDeviceId(Long measuringDeviceId) {
        return measuringDeviceReadingRepository.findByMeasuringDeviceId(measuringDeviceId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDeviceReading> findById(Long measuringDeviceReadingId) {
        return measuringDeviceReadingRepository.findById(measuringDeviceReadingId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDeviceReading> findByMeasuringDeviceIdAndMonthAndYear(Long measuringDeviceId,
                                                                                   String month, String year) {
        return measuringDeviceReadingRepository.findByMeasuringDeviceIdAndMonthAndYear(measuringDeviceId, month, year);
    }

    @Override
    @Transactional
    public void create(MeasuringDeviceReadingDTO measuringDeviceReadingDTO) throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceReadingDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        List<MeasuringDeviceReading> measuringDeviceReadingList = measuringDeviceReadingRepository
                .findByMeasuringDeviceId(foundMeasuringDevice.getId());
        if (measuringDeviceReadingList == null || measuringDeviceReadingList.isEmpty()) {
            measuringDeviceReadingList = new ArrayList<>();
        }
        var foundMeasuringDeviceReading = measuringDeviceReadingList
                .stream()
                .anyMatch(measuringDeviceReading ->
                        measuringDeviceReading.getMonth().equals(String.valueOf(getCurrentMonth())) &&
                                measuringDeviceReading.getYear().equals(String.valueOf(getCurrentYear())));
        if (foundMeasuringDeviceReading) {
            throw new BadRequestException("Measuring device reading for the current month and year already exists");
        }
        String lastMonth = String.valueOf(getPreviousMonth());
        String lastYear = String.valueOf(getCurrentYear());
        if (getCurrentMonth() == Month.JANUARY.getValue()) {
            lastYear = String.valueOf(getPreviousYear());
        }
        Optional<MeasuringDeviceReading> foundPreviousDeviceReading = findByMeasuringDeviceIdAndMonthAndYear(
                measuringDeviceReadingDTO.getMeasuringDeviceId(), lastMonth, lastYear);
        if (foundPreviousDeviceReading.isEmpty()) {
            MeasuringDeviceReading createdPreviousMeasuringDeviceReading = MeasuringDeviceReading.builder()
                    .measuringDevice(foundMeasuringDevice)
                    .month(lastMonth)
                    .year(lastYear)
                    .previousReading(0)
                    .currentReading(0)
                    .build();
            foundPreviousDeviceReading = Optional
                    .of(measuringDeviceReadingRepository.save(createdPreviousMeasuringDeviceReading));
            calculationRepository.save(Calculation.builder()
                    .measuringDeviceReading(foundPreviousDeviceReading.get())
                    .month(lastMonth)
                    .year(lastYear)
                    .totalPayment(calculateTotalPayment(null, null))
                    .build());
        }
        if (measuringDeviceReadingDTO.getCurrentReading() < foundPreviousDeviceReading.get().getPreviousReading()) {
            throw new BadRequestException("Invalid measuring device current reading");
        }
        MeasuringDeviceReading createdMeasuringDeviceReading = MeasuringDeviceReading.builder()
                .measuringDevice(foundMeasuringDevice)
                .month(String.valueOf(getCurrentMonth()))
                .year(String.valueOf(getCurrentYear()))
                .previousReading(foundPreviousDeviceReading.get().getPreviousReading())
                .currentReading(measuringDeviceReadingDTO.getCurrentReading())
                .build();
        measuringDeviceReadingRepository.save(createdMeasuringDeviceReading);
        Receipt foundReceipt = receiptRepository
                .findByMonthAndYear(String.valueOf(getCurrentMonth()), String.valueOf(getCurrentYear()))
                .orElseThrow(() -> new NoSuchElementException("Receipt not found"));
        calculationRepository.save(Calculation.builder()
                .measuringDeviceReading(createdMeasuringDeviceReading)
                .month(String.valueOf(getCurrentMonth()))
                .year(String.valueOf(getCurrentYear()))
                .totalPayment(calculateTotalPayment(createdMeasuringDeviceReading, foundReceipt))
                .build());
    }

    @Override
    @Transactional
    public void update(Long measuringDeviceReadingId, MeasuringDeviceReadingDTO measuringDeviceReadingDTO)
            throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceReadingDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        MeasuringDeviceReading foundMeasuringDeviceReading = findById(measuringDeviceReadingId)
                .orElseThrow(() -> new NoSuchElementException("Measuring device reading not found"));
        String lastMonth = String.valueOf(getPreviousMonth());
        String lastYear = String.valueOf(getCurrentYear());
        if (getCurrentMonth() == Month.JANUARY.getValue()) {
            lastYear = String.valueOf(getPreviousYear());
        }
        Optional<MeasuringDeviceReading> foundPreviousDeviceReading = findByMeasuringDeviceIdAndMonthAndYear(
                measuringDeviceReadingDTO.getMeasuringDeviceId(), lastMonth, lastYear);
        if (foundPreviousDeviceReading.isEmpty()) {
            throw new BadRequestException("Previous measuring device reading not found");
        }
        if (measuringDeviceReadingDTO.getCurrentReading() < foundPreviousDeviceReading.get().getPreviousReading()) {
            throw new BadRequestException("Invalid measuring device current reading");
        }
        foundMeasuringDeviceReading.setMeasuringDevice(foundMeasuringDevice);
        foundMeasuringDeviceReading.setCurrentReading(measuringDeviceReadingDTO.getCurrentReading());
        measuringDeviceReadingRepository.save(foundMeasuringDeviceReading);
        Receipt foundReceipt = receiptRepository
                .findByMonthAndYear(String.valueOf(getCurrentMonth()), String.valueOf(getCurrentYear()))
                .orElseThrow(() -> new NoSuchElementException("Receipt not found"));
        Calculation foundCalculation = calculationRepository.findByMeasuringDeviceReadingIdAndMonthAndYear(
                        foundMeasuringDeviceReading.getId(), String.valueOf(getCurrentMonth()),
                        String.valueOf(getCurrentYear()))
                .orElseThrow(() -> new NoSuchElementException("Calculation not found"));
        foundCalculation.setTotalPayment(calculateTotalPayment(foundMeasuringDeviceReading, foundReceipt));
        calculationRepository.save(foundCalculation);
    }
}
