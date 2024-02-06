package com.sgcc.sgccapi.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "measuring_devices")
public class MeasuringDevice {
    @Id
    private String id;
    private String type;
    private String code;

    @DBRef
    private List<MeasuringDeviceReading> measuringDeviceReadingList;

    @DBRef
    private List<Receipt> receiptList;
}
