package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDTO;
import com.sgcc.sgccapi.models.dtos.MeasuringDeviceReadingDeviceDTO;
import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import com.sgcc.sgccapi.services.IMeasuringDeviceReadingService;
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

@Tag(name = "Measuring device reading", description = "Measuring device reading operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class MeasuringDeviceReadingController {
    private final IMeasuringDeviceReadingService measuringDeviceReadingService;

    @Operation(summary = "Fetch measuring device reading list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the measuring device readings",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/measuring-device-readings", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<MeasuringDeviceReading> measuringDeviceReadingList;
        try {
            measuringDeviceReadingList = measuringDeviceReadingService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the measuring device readings");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", measuringDeviceReadingList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get measuring device reading by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid measuring device reading ID",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device reading not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the measuring device reading",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/measuring-device-readings/{measuringDeviceReadingId}", produces = "application/json")
    public ResponseEntity<?> getOne(@PathVariable String measuringDeviceReadingId) {
        Map<String, Object> response = new HashMap<>();
        MeasuringDeviceReading foundMeasuringDeviceReading;
        try {
            foundMeasuringDeviceReading = measuringDeviceReadingService.findById(measuringDeviceReadingId)
                    .orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Measuring device reading not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the measuring device reading");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundMeasuringDeviceReading);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Register a measuring device reading")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Measuring device reading registered successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Measuring device reading already exists / " +
                    "There was an error while registering the measuring device reading",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while registering the measuring device reading",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/measuring-device-readings", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody MeasuringDeviceReadingDTO measuringDeviceReadingDTO,
                                      BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the measuring device reading");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceReadingService.create(measuringDeviceReadingDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the measuring device reading");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the measuring device reading");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The measuring device reading was registered successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Modify measuring device reading values")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Measuring device reading updated successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Measuring device reading already exists / " +
                    "There was an error while updating the measuring device reading",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device reading not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while updating the measuring device reading",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-device-readings/{measuringDeviceReadingId}", produces = "application/json")
    public ResponseEntity<?> updateValue(@Valid @RequestBody MeasuringDeviceReadingDTO measuringDeviceReadingDTO,
                                         BindingResult result, @PathVariable String measuringDeviceReadingId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while updating measuring device reading values");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceReadingService.update(measuringDeviceReadingId, measuringDeviceReadingDTO);
        } catch (NoSuchElementException | BadRequestException e) {
            response.put("message", "There was an error while updating measuring device reading values");
            response.put("details", List.of(e.getMessage()));
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while updating measuring device reading values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The measuring device reading was updated successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Add measuring device reading to measuring device")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Measuring device reading added to measuring device successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while adding measuring device reading to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404",
                    description = "Measuring device reading or measuring device not found / " +
                            "Measuring device reading already added to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while adding measuring device reading to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-device-readings/measuring-devices/add", produces = "application/json")
    public ResponseEntity<?> addMeasuringDeviceReadingToMeasuringDevice(
            @Valid @RequestBody MeasuringDeviceReadingDeviceDTO measuringDeviceRoomDTODeviceDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while adding measuring device reading to " +
                        "measuring device");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceReadingService.addMeasuringDeviceReadingToMDevice(measuringDeviceRoomDTODeviceDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while adding measuring device reading to measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while adding measuring device reading to measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while adding measuring device reading to measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Measuring device reading added to measuring device successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Delete measuring device reading from measuring device")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Measuring device reading deleted from measuring device successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while deleting measuring device reading from measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Measuring device reading or measuring device not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while deleting measuring device reading from measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/measuring-device-readings/measuring-devices/delete", produces = "application/json")
    public ResponseEntity<?> deleteMeasuringDeviceReadingFromMeasuringDevice(
            @Valid @RequestBody MeasuringDeviceReadingDeviceDTO measuringDeviceRoomDTODeviceDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while deleting measuring device reading from" +
                        " measuring device");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            measuringDeviceReadingService.deleteMeasuringDeviceReadingFromMDevice(measuringDeviceRoomDTODeviceDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while deleting measuring device reading from " +
                    "measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while deleting measuring device reading from " +
                    "measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Measuring device reading deleted from measuring device successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
