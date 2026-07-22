package com.sgcc.tenant.presentation;

import com.sgcc.tenant.application.TenantService;
import com.sgcc.tenant.domain.Tenant;
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
    public ResponseEntity<List<Tenant>> findAll() {
        return ResponseEntity.ok(tenantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> findById(@PathVariable String id) {
        return tenantService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tenant> create(@RequestBody CreateTenantRequest request) {
        Tenant tenant = tenantService.create(
                request.name(),
                request.documentNumber(),
                request.phone(),
                request.email()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(tenant);
    }

    public record CreateTenantRequest(
            String name,
            String documentNumber,
            String phone,
            String email
    ) {}
}
