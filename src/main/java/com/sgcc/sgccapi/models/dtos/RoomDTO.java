package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    @NotEmpty(message = "{notEmpty.roomDTO.roomNumber}")
    @Size(max = 2, message = "{size.roomDTO.roomNumber}")
    private String roomNumber;
}
