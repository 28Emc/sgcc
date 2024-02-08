package com.sgcc.sgccapi.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "measuring_devices")
public class MeasuringDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String code;

    // @OneToMany(mappedBy = "measuringDevice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<MeasuringDeviceReading> measuringDeviceReadingList;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
