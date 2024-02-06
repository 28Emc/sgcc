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
public class MeasuringDeviceRoomDTO {
    @NotEmpty(message = "{notEmpty.measuringDeviceRoomDTO.measuringDeviceId}")
    private String measuringDeviceId;

    @NotEmpty(message = "{notEmpty.measuringDeviceRoomDTO.roomId}")
    private String roomId;
}
