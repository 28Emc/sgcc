package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.dtos.TenantDTO;
import com.sgcc.sgccapi.models.entities.Tenant;
import com.sgcc.sgccapi.services.ITenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Tag(name = "Tenant", description = "Tenant operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class TenantController {
    private final ITenantService tenantService;

    @Operation(summary = "Fetch tenant list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the tenants",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/tenants", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<Tenant> tenantList;
        try {
            tenantList = tenantService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the tenants");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", tenantList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get tenant by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
            }),
            @ApiResponse(responseCode = "400", description = "Invalid tenant ID", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
            }),
            @ApiResponse(responseCode = "404", description = "Tenant not found", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
            }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the tenant",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/tenants/{tenantId}", produces = "application/json")
    public ResponseEntity<?> getOne(@PathVariable String tenantId) {
        Map<String, Object> response = new HashMap<>();
        Tenant foundTenant;
        try {
            foundTenant = tenantService.findById(tenantId).orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Tenant not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the tenant");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundTenant);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Register a tenant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tenant registered successfully", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
            }),
            @ApiResponse(responseCode = "400", description = "Tenant already exists / " +
                    "There was an error while registering the tenant",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while registering the tenant",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/tenants", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody TenantDTO tenantDTO, BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the tenant");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            tenantService.create(tenantDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the tenant");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the tenant");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The tenant was registered successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Modify tenant values")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tenant updated successfully", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
            }),
            @ApiResponse(responseCode = "400", description = "Tenant already exists / " +
                    "There was an error while registering the tenant",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Tenant not found", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
            }),
            @ApiResponse(responseCode = "500", description = "There was an error while updating the tenant",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/tenants/{tenantId}", produces = "application/json")
    public ResponseEntity<?> updateValue(@Valid @RequestBody TenantDTO tenantDTO, BindingResult result,
                                         @PathVariable String tenantId) {
        Map<String, Object> response = new HashMap<>();
        Tenant foundTenant;
        try {
            foundTenant = tenantService.findById(tenantId).orElseThrow();
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while updating tenant values");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else if (tenantService.findByFullName(tenantDTO.getFullName()).isPresent() &&
                    !foundTenant.getFullName().equals(tenantDTO.getFullName())) {
                response.put("message", "Tenant already exists");
                response.put("details", List.of());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            tenantService.update(tenantId, tenantDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "Tenant not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while updating tenant values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The tenant was updated successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
