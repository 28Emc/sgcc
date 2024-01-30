package com.sgcc.sgccapi.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
