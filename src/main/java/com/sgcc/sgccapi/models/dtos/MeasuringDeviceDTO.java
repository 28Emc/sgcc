package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeasuringDeviceDTO {
    @NotNull(message = "{notNull.measuringDeviceDTO.roomId}")
    private Long roomId;

    @NotEmpty(message = "{notEmpty.measuringDeviceDTO.type}")
    @Size(max = 1, message = "{size.measuringDeviceDTO.type}")
    private String type;

    @NotEmpty(message = "{notEmpty.measuringDeviceDTO.code}")
    @Size(max = 20, message = "{size.measuringDeviceDTO.code}")
    private String code;
}
