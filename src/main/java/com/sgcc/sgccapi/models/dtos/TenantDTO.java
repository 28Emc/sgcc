package com.sgcc.sgccapi.models.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantDTO {
    @NotEmpty(message = "{notEmpty.tenantDTO.fullName}")
    @Size(max = 100, message = "{size.tenantDTO.fullName}")
    private String fullName;

    @NotEmpty(message = "{notEmpty.tenantDTO.docNumber}")
    @Size(max = 20, message = "{size.tenantDTO.docNumber}")
    private String docNumber;
}
