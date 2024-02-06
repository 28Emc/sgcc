package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceRoomDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDevice;
import com.sgcc.sgccapi.services.IMeasuringDeviceService;
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

@Tag(name = "Measuring device", description = "Measuring device operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class MeasuringDeviceController {
    private final IMeasuringDeviceService measuringDeviceService;

    @Operation(summary = "Fetch measuring device list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the measuring devices",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/measuring-devices", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<MeasuringDevice> measuringDeviceList;
        try {
            measuringDeviceList = measuringDeviceService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the measuring devices");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", measuringDeviceList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get measuring device by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid measuring device ID",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/measuring-devices/{measuringDeviceId}", produces = "application/json")
    public ResponseEntity<?> getOne(@PathVariable String measuringDeviceId) {
        Map<String, Object> response = new HashMap<>();
        MeasuringDevice foundMeasuringDevice;
        try {
            foundMeasuringDevice = measuringDeviceService.findById(measuringDeviceId).orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Measuring device not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundMeasuringDevice);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Register a measuring device")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Measuring device registered successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Measuring device already exists / " +
                    "There was an error while registering the measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while registering the measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/measuring-devices", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody MeasuringDeviceDTO measuringDeviceDTO,
                                      BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the measuring device");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceService.create(measuringDeviceDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The measuring device was registered successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Modify measuring device values")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Measuring device updated successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Measuring device already exists / " +
                    "There was an error while updating the measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while updating the measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-devices/{measuringDeviceId}", produces = "application/json")
    public ResponseEntity<?> updateValue(@Valid @RequestBody MeasuringDeviceDTO measuringDeviceDTO,
                                         BindingResult result, @PathVariable String measuringDeviceId) {
        Map<String, Object> response = new HashMap<>();
        MeasuringDevice foundMeasuringDevice;
        try {
            foundMeasuringDevice = measuringDeviceService.findById(measuringDeviceId).orElseThrow();
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while updating measuring device values");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else if (measuringDeviceService.findByCode(measuringDeviceDTO.getCode()).isPresent() &&
                    !foundMeasuringDevice.getCode().equals(measuringDeviceDTO.getCode())) {
                response.put("message", "Measuring device already exists");
                response.put("details", List.of());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceService.update(measuringDeviceId, measuringDeviceDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "Measuring device not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while updating measuring device values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The measuring device was updated successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Add measuring device to room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Measuring device added to room successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while adding measuring device to room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device or room not found / " +
                    "Measuring device already added to room", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
            }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while adding measuring device to room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-devices/rooms/add", produces = "application/json")
    public ResponseEntity<?> addMeasuringDeviceToRoom(
            @Valid @RequestBody MeasuringDeviceRoomDTO measuringDeviceRoomDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while adding measuring device to room");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceService.addMeasuringDeviceToRoom(measuringDeviceRoomDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while adding measuring device to room");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while adding measuring device to room");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while adding measuring device to room");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Measuring device added to room successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Delete measuring device from room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Measuring device deleted from room successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while deleting measuring device from room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device or room not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while deleting measuring device from room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-devices/rooms/delete", produces = "application/json")
    public ResponseEntity<?> deleteMeasuringDeviceFromRoom(
            @Valid @RequestBody MeasuringDeviceRoomDTO measuringDeviceRoomDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while deleting measuring device from room");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceService.deleteMeasuringDeviceFromRoom(measuringDeviceRoomDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while deleting measuring device from room");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while deleting measuring device from room");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Measuring device deleted from room successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
