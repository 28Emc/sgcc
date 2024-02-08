package com.sgcc.sgccapi.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "measuring_device_readings")
public class MeasuringDeviceReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String month;
    private String year;
    private Integer currentReading;
    private Integer previousReading;

    // @OneToOne(mappedBy = "measuringDeviceReading", cascade = CascadeType.ALL)
    // private Calculation calculation;

    @ManyToOne
    @JoinColumn(name = "measuring_device_id")
    private MeasuringDevice measuringDevice;
}
