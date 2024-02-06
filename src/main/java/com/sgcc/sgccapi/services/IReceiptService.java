package com.sgcc.sgccapi.services;

import com.sgcc.sgccapi.models.dtos.PaymentCalculationDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptMeasuringDeviceDTO;
import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.models.entities.Receipt;
import org.apache.coyote.BadRequestException;

import java.util.List;
import java.util.Optional;

public interface IReceiptService {
    List<Receipt> findAll();

    List<Receipt> findByYear(String yearNumber);

    Optional<Receipt> findById(String receiptId);

    Optional<Receipt> findByMonth(String monthNumber);

    Optional<Receipt> findByMonthAndYear(String monthNumber, String yearNumber);

    void create(ReceiptDTO receiptDTO) throws BadRequestException;

    // Calculation registerAndCalculatePayment(PaymentCalculationDTO paymentCalculationDTO) throws BadRequestException;

    void addReceiptToMeasuringDevice(ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO)
            throws BadRequestException;

    void deleteReceiptFromMeasuringDevice(ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO);

    void update(String receiptId, ReceiptDTO receiptDTO) throws BadRequestException;
}
