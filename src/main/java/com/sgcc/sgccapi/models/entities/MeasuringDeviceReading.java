package com.sgcc.sgccapi.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "measuring_device_readings")
public class MeasuringDeviceReading {
    @Id
    private String id;
    private String month;
    private String year;
    private Integer currentReading;
    private Integer previousReading;

    @DBRef
    private Calculation calculation;

}
