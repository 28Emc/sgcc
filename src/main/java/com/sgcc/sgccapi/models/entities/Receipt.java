package com.sgcc.sgccapi.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "receipts")
public class Receipt {
    @Id
    private String id;
    private String month;
    private String year;
    private Integer totalConsumption;
    private BigDecimal totalPayment;
    private BigDecimal unitPrice;
}
