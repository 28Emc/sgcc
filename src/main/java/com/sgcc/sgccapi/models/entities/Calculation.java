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
@Document(collection = "calculations")
public class Calculation {
    @Id
    private String id;
    private String month;
    private String year;
    private BigDecimal totalPayment;
}
