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
@Table(name = "housings")
public class Housing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;

    // @OneToMany(mappedBy = "housing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<Room> roomList;

    // @OneToMany(mappedBy = "housing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<Receipt> receiptList;
}
