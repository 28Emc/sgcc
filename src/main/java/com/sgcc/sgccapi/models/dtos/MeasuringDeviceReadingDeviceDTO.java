package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeasuringDeviceReadingDeviceDTO {
    @NotEmpty(message = "{notEmpty.measuringDeviceReadingDeviceDTO.measuringDeviceReadingId}")
    private String measuringDeviceReadingId;

    @NotEmpty(message = "{notEmpty.measuringDeviceReadingDeviceDTO.measuringDeviceId}")
    private String measuringDeviceId;
}
