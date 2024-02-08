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
public class ReceiptMeasuringDeviceDTO {
    @NotNull(message = "{notNull.receiptMeasuringDeviceDTO.receiptId}")
    private Long receiptId;

    @NotNull(message = "{notNull.receiptMeasuringDeviceDTO.measuringDeviceId}")
    private Long measuringDeviceId;
}
