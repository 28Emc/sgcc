package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomTenantDTO {
    @NotEmpty(message = "{notEmpty.roomTenantDTO.roomId}")
    private String roomId;

    @NotEmpty(message = "{notEmpty.roomTenantDTO.tenantId}")
    private String tenantId;
}
