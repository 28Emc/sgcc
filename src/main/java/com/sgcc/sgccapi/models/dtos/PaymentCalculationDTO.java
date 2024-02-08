package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCalculationDTO {
    @NotNull(message = "{notNull.paymentCalculationDTO.measuringDeviceId}")
    private Long measuringDeviceId;

    @NotEmpty(message = "{notEmpty.paymentCalculationDTO.receiptType}")
    @Size(max = 50, message = "{size.paymentCalculationDTO.receiptType}")
    private String receiptType;

    @NotEmpty(message = "{notEmpty.paymentCalculationDTO.monthNumber}")
    @Size(min = 1, max = 2, message = "{size.paymentCalculationDTO.monthNumber}")
    private String monthNumber;

    @NotEmpty(message = "{notEmpty.paymentCalculationDTO.yearNumber}")
    @Size(min = 4, max = 4, message = "{size.paymentCalculationDTO.yearNumber}")
    private String yearNumber;

    @NotNull(message = "{notNull.paymentCalculationDTO.totalConsumption}")
    @PositiveOrZero(message = "{positiveOrZero.paymentCalculationDTO.totalConsumption}")
    @Digits(integer = 10, fraction = 0, message = "{digits.paymentCalculationDTO.totalConsumption}")
    private Integer totalConsumption;

    @NotNull(message = "{notNull.paymentCalculationDTO.totalPayment}")
    @Digits(integer = 4, fraction = 2, message = "{digits.paymentCalculationDTO.totalPayment}")
    private BigDecimal totalPayment;

    /*@NotNull(message = "{notNull.paymentCalculationDTO.unitPrice}")
    @Digits(integer = 1, fraction = 2, message = "{digits.paymentCalculationDTO.unitPrice}")
    private BigDecimal unitPrice;*/
}
