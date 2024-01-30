package com.sgcc.sgccapi.models.entities;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tenants")
public class Tenant {
    @Id
    private String id;
    private String docNumber;
    private String fullName;

    @DBRef
    private List<Room> roomList;
}
