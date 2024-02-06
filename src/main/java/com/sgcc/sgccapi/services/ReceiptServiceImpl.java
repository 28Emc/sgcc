package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.PaymentCalculationDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptMeasuringDeviceDTO;
import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import com.sgcc.sgccapi.models.entities.Receipt;
import com.sgcc.sgccapi.repositories.ICalculationRepository;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceReadingRepository;
import com.sgcc.sgccapi.repositories.IMeasuringDeviceRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static com.sgcc.sgccapi.utils.Utils.*;

@Service
@AllArgsConstructor
public class ReceiptServiceImpl implements IReceiptService {
    private final IReceiptRepository receiptRepository;
    private final IMeasuringDeviceRepository measuringDeviceRepository;
    private final IMeasuringDeviceReadingRepository measuringDeviceReadingRepository;
    private final ICalculationRepository calculationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Receipt> findAll() {
        return receiptRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Receipt> findByYear(String yearNumber) {
        return receiptRepository.findByYear(yearNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Receipt> findById(String receiptId) {
        return receiptRepository.findById(receiptId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Receipt> findByMonth(String monthNumber) {
        return receiptRepository.findByMonth(monthNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Receipt> findByMonthAndYear(String monthNumber, String yearNumber) {
        return receiptRepository.findByMonthAndYear(monthNumber, yearNumber);
    }

    @Override
    @Transactional
    public void create(ReceiptDTO receiptDTO) throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository.findById(receiptDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        if (!(isValidMonth(receiptDTO.getMonthNumber()) || isValidYear(receiptDTO.getYearNumber()))) {
            throw new BadRequestException("Invalid receipt month or year values");
        }
        boolean foundReceipt = findByMonthAndYear(receiptDTO.getMonthNumber(),
                receiptDTO.getYearNumber()).isPresent();
        if (foundReceipt) {
            throw new BadRequestException("Receipt already registered");
        }
        Receipt createdReceipt = receiptRepository.save(
                Receipt.builder()
                        .month(receiptDTO.getMonthNumber())
                        .year(receiptDTO.getYearNumber())
                        .totalConsumption(receiptDTO.getTotalConsumption())
                        .totalPayment(receiptDTO.getTotalPayment())
                        .unitPrice(calculateUnitPrice(receiptDTO.getTotalConsumption(), receiptDTO.getTotalPayment()))
                        .build());
        addReceiptToMeasuringDevice(new ReceiptMeasuringDeviceDTO(createdReceipt.getId(),
                foundMeasuringDevice.getId()));
    }

    /*@Override
    @Transactional
    public Calculation registerAndCalculatePayment(PaymentCalculationDTO paymentCalculationDTO)
            throws BadRequestException {
        if (!(isValidMonth(paymentCalculationDTO.getMonthNumber()) ||
                isValidYear(paymentCalculationDTO.getYearNumber()))) {
            throw new BadRequestException("Invalid receipt month or year values");
        }
        Optional<MeasuringDevice> foundMeasuringDevice = measuringDeviceRepository
                .findById(paymentCalculationDTO.getMeasuringDeviceId());
        if (foundMeasuringDevice.isEmpty()) {
            throw new NoSuchElementException("Measuring device not found");
        }
        List<Receipt> receiptList = foundMeasuringDevice.get().getReceiptList();
        boolean foundReceipt = receiptList.stream().anyMatch(receipt ->
                receipt.getMonth().equals(paymentCalculationDTO.getMonthNumber()) &&
                        receipt.getYear().equals(paymentCalculationDTO.getYearNumber()));
        if (foundReceipt) {
            throw new BadRequestException("Receipt already registered");
        }
        Receipt createdReceipt = Receipt.builder()
                .month(paymentCalculationDTO.getMonthNumber())
                .year(paymentCalculationDTO.getYearNumber())
                .totalConsumption(paymentCalculationDTO.getTotalConsumption())
                .totalPayment(paymentCalculationDTO.getTotalPayment())
                .unitPrice(calculateUnitPrice(paymentCalculationDTO.getTotalConsumption(),
                        paymentCalculationDTO.getTotalPayment()))
                .build();
        receiptRepository.save(createdReceipt);
        Optional<MeasuringDeviceReading> foundMeasuringDeviceReading = foundMeasuringDevice.get()
                .getMeasuringDeviceReadingList()
                .stream()
                .filter(measuringDeviceReading ->
                        measuringDeviceReading.getMonth().equals(paymentCalculationDTO.getMonthNumber())
                                && measuringDeviceReading.getYear().equals(paymentCalculationDTO.getYearNumber())
                ).findFirst();
        if (foundMeasuringDeviceReading.isEmpty()) {
            throw new BadRequestException("Measuring device reading for current month and year not found");
        }
        double consumption = foundMeasuringDeviceReading.get().getCurrentReading() -
                foundMeasuringDeviceReading.get().getPreviousReading();
        BigDecimal totalConsumptionPayment = BigDecimal.valueOf(consumption).multiply(createdReceipt.getUnitPrice());
        Calculation foundCalculation = foundMeasuringDeviceReading.get().getCalculation();
        if (foundCalculation != null) {
            throw new BadRequestException("Calculation already registered for current month and year");
        }
        Calculation createdCalculation = calculationRepository.save(Calculation.builder()
                .month(paymentCalculationDTO.getMonthNumber())
                .year(paymentCalculationDTO.getYearNumber())
                .totalPayment(totalConsumptionPayment)
                .build());
        foundMeasuringDeviceReading.get().setCalculation(createdCalculation);
        measuringDeviceReadingRepository.save(foundMeasuringDeviceReading.get());
        return createdCalculation;
    }*/

    @Override
    @Transactional
    public void addReceiptToMeasuringDevice(ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO)
            throws BadRequestException {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(receiptMeasuringDeviceDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        Receipt foundReceipt = findById(receiptMeasuringDeviceDTO.getReceiptId())
                .orElseThrow(() -> new NoSuchElementException("Receipt not found"));
        List<Receipt> receiptList = foundMeasuringDevice.getReceiptList();
        if (receiptList == null || receiptList.isEmpty()) {
            receiptList = new ArrayList<>();
        }
        boolean alreadyAddedReceipt = receiptList.stream()
                .anyMatch(receipt -> receipt.getId().equals(foundReceipt.getId()));
        if (alreadyAddedReceipt) {
            throw new BadRequestException("Receipt already registered");
        }
        receiptList.add(foundReceipt);
        foundMeasuringDevice.setReceiptList(receiptList);
        measuringDeviceRepository.save(foundMeasuringDevice);
    }

    @Override
    @Transactional
    public void deleteReceiptFromMeasuringDevice(ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO) {
        MeasuringDevice foundMeasuringDevice = measuringDeviceRepository
                .findById(receiptMeasuringDeviceDTO.getMeasuringDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Measuring device not found"));
        Receipt foundReceipt = findById(receiptMeasuringDeviceDTO.getReceiptId())
                .orElseThrow(() -> new NoSuchElementException("Receipt not found"));
        List<Receipt> receiptList = foundMeasuringDevice.getReceiptList();
        receiptList.removeIf(receipt -> receipt.getId().equals(foundReceipt.getId()));
        foundMeasuringDevice.setReceiptList(receiptList);
        measuringDeviceRepository.save(foundMeasuringDevice);
    }

    @Override
    @Transactional
    public void update(String receiptId, ReceiptDTO receiptDTO) throws BadRequestException {
        Receipt foundReceipt = findById(receiptId)
                .orElseThrow(() -> new NoSuchElementException("Receipt not found"));
        Optional<Receipt> foundReceiptByMonthAndYear = findByMonthAndYear(receiptDTO.getMonthNumber(),
                receiptDTO.getYearNumber());
        if (foundReceiptByMonthAndYear.isPresent() &&
                !(foundReceiptByMonthAndYear.get().getMonth().equals(receiptDTO.getMonthNumber()) ||
                        foundReceiptByMonthAndYear.get().getYear().equals(receiptDTO.getYearNumber()))) {
            throw new BadRequestException("Receipt already registered");
        }
        foundReceipt.setYear(receiptDTO.getYearNumber());
        foundReceipt.setMonth(receiptDTO.getMonthNumber());
        foundReceipt.setTotalConsumption(receiptDTO.getTotalConsumption());
        foundReceipt.setTotalConsumption(receiptDTO.getTotalConsumption());
        foundReceipt.setUnitPrice(calculateUnitPrice(receiptDTO.getTotalConsumption(),
                receiptDTO.getTotalPayment()));
        receiptRepository.save(foundReceipt);

        Optional<Calculation> foundCalculation = calculationRepository
                .findByMonthAndYear(receiptDTO.getMonthNumber(), receiptDTO.getYearNumber());
        if (foundCalculation.isPresent()) {
            // foundCalculation.get().setTotalPayment(0);
            calculationRepository.save(foundCalculation.get());
        }
    }
}
