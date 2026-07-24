package com.sgcc.tenant.presentation;

import com.sgcc.tenant.application.TenantService;
import com.sgcc.tenant.domain.Tenant;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public ResponseEntity<List<TenantService.TenantListResponse>> findAll() {
        return ResponseEntity.ok(tenantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> findById(@PathVariable String id) {
        return tenantService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tenant> create(@Valid @RequestBody CreateTenantRequest request) {
        Tenant tenant = tenantService.create(
                request.name(),
                request.documentNumber(),
                request.phone(),
                request.email()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(tenant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tenant> update(@PathVariable String id,
                                         @Valid @RequestBody UpdateTenantRequest request) {
        return tenantService.update(id, request.name(), request.phone(), request.email())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        tenantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateTenantRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Document number is required") String documentNumber,
            String phone,
            @Email(message = "Invalid email format") String email
    ) {}

    public record UpdateTenantRequest(
            @NotBlank(message = "Name is required") String name,
            String phone,
            @Email(message = "Invalid email format") String email
    ) {}
}
