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
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomNumber;

    // @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<MeasuringDevice> measuringDeviceList;

    // @OneToOne(mappedBy = "room", cascade = CascadeType.ALL)
    // private Tenant tenant;

    @ManyToOne
    @JoinColumn(name = "housing_id")
    private Housing housing;
}
