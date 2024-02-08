package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeasuringDeviceRoomDTO {
    @NotNull(message = "{notNull.measuringDeviceRoomDTO.measuringDeviceId}")
    private Long measuringDeviceId;

    @NotNull(message = "{notNull.measuringDeviceRoomDTO.roomId}")
    private Long roomId;
}
