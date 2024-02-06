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
public class MeasuringDeviceReadingDTO {
    /*@NotEmpty(message = "{notEmpty.measuringDeviceReadingDTO.month}")
    @Size(max = 50, message = "{size.measuringDeviceReadingDTO.month}")
    private String month;

    @NotEmpty(message = "{notEmpty.measuringDeviceReadingDTO.year}")
    @Size(max = 50, message = "{size.measuringDeviceReadingDTO.year}")
    private String year;*/

    @NotEmpty(message = "{notEmpty.measuringDeviceReadingDTO.measuringDeviceId}")
    private String measuringDeviceId;

    @NotNull(message = "{notNull.measuringDeviceReadingDTO.currentReading}")
    @PositiveOrZero(message = "{positiveOrZero.measuringDeviceReadingDTO.currentReading}")
    @Digits(integer = 6, fraction = 0, message = "{digits.measuringDeviceReadingDTO.currentReading}")
    private Integer currentReading;

    /*@NotNull(message = "{notNull.measuringDeviceReadingDTO.previousReading}")
    @PositiveOrZero(message = "{positiveOrZero.measuringDeviceReadingDTO.previousReading}")
    @Digits(integer = 6, fraction = 0, message = "{digits.measuringDeviceReadingDTO.previousReading}")
    private Integer previousReading;*/
}
