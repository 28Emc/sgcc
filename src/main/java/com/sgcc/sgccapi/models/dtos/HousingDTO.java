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
public class HousingDTO {
    @NotEmpty(message = "{notEmpty.housingDTO.address}")
    @Size(max = 255, message = "{size.housing.address}")
    private String address;
}
