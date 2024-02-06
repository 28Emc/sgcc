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
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;

    @DBRef
    private List<MeasuringDevice> measuringDeviceList;
}
