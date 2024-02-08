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
public class ReceiptDTO {
    @NotNull(message = "{notNull.receiptDTO.housingId}")
    private Long housingId;

    /*@NotNull(message = "{notNull.receiptDTO.measuringDeviceId}")
    private Long measuringDeviceId;*/

    @NotEmpty(message = "{notEmpty.receiptDTO.monthNumber}")
    @Size(min = 1, max = 2, message = "{size.receiptDTO.monthNumber}")
    private String monthNumber;

    @NotEmpty(message = "{notEmpty.receiptDTO.yearNumber}")
    @Size(min = 4, max = 4, message = "{size.receiptDTO.yearNumber}")
    private String yearNumber;

    @NotNull(message = "{notNull.receiptDTO.totalConsumption}")
    @PositiveOrZero(message = "{positiveOrZero.receiptDTO.totalConsumption}")
    @Digits(integer = 10, fraction = 0, message = "{digits.receiptDTO.totalConsumption}")
    private Integer totalConsumption;

    @NotNull(message = "{notNull.receiptDTO.totalPayment}")
    @Digits(integer = 4, fraction = 2, message = "{digits.receiptDTO.totalPayment}")
    private BigDecimal totalPayment;
}
