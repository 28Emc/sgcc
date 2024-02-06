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
public class ReceiptMeasuringDeviceDTO {
    @NotEmpty(message = "{notEmpty.receiptMeasuringDeviceDTO.receiptId}")
    private String receiptId;

    @NotEmpty(message = "{notEmpty.receiptMeasuringDeviceDTO.measuringDeviceId}")
    private String measuringDeviceId;
}
