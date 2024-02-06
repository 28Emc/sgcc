package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDeviceDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceReadingRepository;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional(readOnly = true)
    public List<MeasuringDeviceReading> findAll() {
        return measuringDeviceReadingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDeviceReading> findById(String measuringDeviceReadingId) {
        return measuringDeviceReadingRepository.findById(measuringDeviceReadingId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MeasuringDeviceReading> findByMonthAndYear(String month, String year) {
        return measuringDeviceReadingRepository.findByMonthAndYear(month, year);
    }

    @Override
    @Transactional
    public void create(MeasuringDeviceReadingDTO measuringDeviceReadingDTO) throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceReadingDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        List<MeasuringDeviceReading> measuringDeviceReadingList = foundMeasuringDevice.getMeasuringDeviceReadingList();
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
        Optional<MeasuringDeviceReading> foundPreviousDeviceReading = findByMonthAndYear(lastMonth, lastYear);
        if (foundPreviousDeviceReading.isEmpty()) {
            MeasuringDeviceReading createdPreviousMeasuringDeviceReading = MeasuringDeviceReading.builder()
                    .month(lastMonth)
                    .year(lastYear)
                    .previousReading(0)
                    .currentReading(0)
                    .calculation(null)
                    .build();
            foundPreviousDeviceReading = Optional
                    .of(measuringDeviceReadingRepository.save(createdPreviousMeasuringDeviceReading));
            addMeasuringDeviceReadingToMDevice(new MeasuringDeviceReadingDeviceDTO(
                    foundPreviousDeviceReading.get().getId(), foundMeasuringDevice.getId()));
        }
        if (measuringDeviceReadingDTO.getCurrentReading() < foundPreviousDeviceReading.get().getPreviousReading()) {
            throw new BadRequestException("Invalid measuring device current reading");
        }
        MeasuringDeviceReading createdMeasuringDeviceReading = MeasuringDeviceReading.builder()
                .month(String.valueOf(getCurrentMonth()))
                .year(String.valueOf(getCurrentYear()))
                .previousReading(foundPreviousDeviceReading.get().getPreviousReading())
                .currentReading(measuringDeviceReadingDTO.getCurrentReading())
                .calculation(null)
                .build();
        measuringDeviceReadingRepository.save(createdMeasuringDeviceReading);
        addMeasuringDeviceReadingToMDevice(new MeasuringDeviceReadingDeviceDTO(
                createdMeasuringDeviceReading.getId(), foundMeasuringDevice.getId()));
    }

    @Override
    @Transactional
    public void addMeasuringDeviceReadingToMDevice(
            MeasuringDeviceReadingDeviceDTO measuringDeviceReadingDeviceDTO) throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceReadingDeviceDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        MeasuringDeviceReading foundMeasuringDeviceReading =
                findById(measuringDeviceReadingDeviceDTO.getMeasuringDeviceReadingId())
                        .orElseThrow(() -> new NoSuchElementException("Measuring device reading not found"));
        List<MeasuringDeviceReading> measuringDeviceReadingList = foundMeasuringDevice
                .getMeasuringDeviceReadingList();
        if (measuringDeviceReadingList == null || measuringDeviceReadingList.isEmpty()) {
            measuringDeviceReadingList = new ArrayList<>();
        }
        boolean alreadyAddedMeasuringDeviceReading = measuringDeviceReadingList.stream()
                .anyMatch(mdr -> mdr.getId().equals(foundMeasuringDeviceReading.getId()));
        if (alreadyAddedMeasuringDeviceReading) {
            throw new BadRequestException("Measuring device reading already registered");
        }
        measuringDeviceReadingList.add(foundMeasuringDeviceReading);
        foundMeasuringDevice.setMeasuringDeviceReadingList(measuringDeviceReadingList);
        measuringDeviceRepository.save(foundMeasuringDevice);
    }

    @Override
    @Transactional
    public void deleteMeasuringDeviceReadingFromMDevice(
            MeasuringDeviceReadingDeviceDTO measuringDeviceReadingDeviceDTO) {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(measuringDeviceReadingDeviceDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        MeasuringDeviceReading foundMeasuringDeviceReading =
                findById(measuringDeviceReadingDeviceDTO.getMeasuringDeviceReadingId())
                        .orElseThrow(() -> new NoSuchElementException("Measuring device reading not found"));
        List<MeasuringDeviceReading> measuringDeviceReadingList = foundMeasuringDevice
                .getMeasuringDeviceReadingList();
        measuringDeviceReadingList.removeIf(mdr -> mdr.getId().equals(foundMeasuringDeviceReading.getId()));
        foundMeasuringDevice.setMeasuringDeviceReadingList(measuringDeviceReadingList);
        measuringDeviceRepository.save(foundMeasuringDevice);
    }

    @Override
    @Transactional
    public void update(String measuringDeviceReadingId, MeasuringDeviceReadingDTO measuringDeviceReadingDTO)
            throws BadRequestException {
        MeasuringDeviceReading foundMeasuringDeviceReading = findById(measuringDeviceReadingId)
                .orElseThrow(() -> new NoSuchElementException("Measuring device reading not found"));
        String lastMonth = String.valueOf(getPreviousMonth());
        String lastYear = String.valueOf(getCurrentYear());
        if (getCurrentMonth() == Month.JANUARY.getValue()) {
            lastYear = String.valueOf(getPreviousYear());
        }
        Optional<MeasuringDeviceReading> foundPreviousDeviceReading = findByMonthAndYear(lastMonth, lastYear);
        if (foundPreviousDeviceReading.isEmpty()) {
            throw new BadRequestException("Previous measuring device reading not found");
        }
        if (measuringDeviceReadingDTO.getCurrentReading() < foundPreviousDeviceReading.get().getPreviousReading()) {
            throw new BadRequestException("Invalid measuring device current reading");
        }
        foundMeasuringDeviceReading.setCurrentReading(measuringDeviceReadingDTO.getCurrentReading());
        // foundMeasuringDeviceReading.setPreviousReading(measuringDeviceReadingDTO.getPreviousReading());
        measuringDeviceReadingRepository.save(foundMeasuringDeviceReading);
    }
}
