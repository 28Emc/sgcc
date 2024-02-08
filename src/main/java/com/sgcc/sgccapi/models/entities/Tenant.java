package com.sgcc.sgccapi.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tenants")
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String docNumber;
    private String fullName;

    @OneToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
