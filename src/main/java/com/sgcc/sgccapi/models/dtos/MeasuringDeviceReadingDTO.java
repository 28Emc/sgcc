package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeasuringDeviceReadingDTO {
    @NotNull(message = "{notNull.measuringDeviceReadingDTO.measuringDeviceId}")
    private Long measuringDeviceId;

    @NotNull(message = "{notNull.measuringDeviceReadingDTO.currentReading}")
    @PositiveOrZero(message = "{positiveOrZero.measuringDeviceReadingDTO.currentReading}")
    @Digits(integer = 6, fraction = 0, message = "{digits.measuringDeviceReadingDTO.currentReading}")
    private Integer currentReading;
}
