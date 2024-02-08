package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomTenantDTO {
    @NotNull(message = "{notNull.roomTenantDTO.roomId}")
    private Long roomId;

    @NotNull(message = "{notNull.roomTenantDTO.tenantId}")
    private Long tenantId;
}
