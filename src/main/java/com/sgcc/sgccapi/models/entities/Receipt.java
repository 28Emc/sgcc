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
@Table(name = "receipts")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String month;
    private String year;
    private Integer totalConsumption;
    private BigDecimal totalPayment;
    private BigDecimal unitPrice;

    @ManyToOne
    @JoinColumn(name = "housing_id")
    private Housing housing;
}
