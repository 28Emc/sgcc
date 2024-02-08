package com.sgcc.sgccapi.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "calculations")
public class Calculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String month;
    private String year;
    private BigDecimal totalPayment;

    @OneToOne
    @JoinColumn(name = "measuring_device_reading_id")
    private MeasuringDeviceReading measuringDeviceReading;

}
