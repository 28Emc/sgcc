package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.services.ICalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static com.sgcc.sgccapi.utils.Utils.ID_REGEXP;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Tag(name = "Calculation", description = "Calculation operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class CalculationController {
    private final ICalculationService calculationService;

    @Operation(summary = "Fetch calculation list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the calculations",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/calculations", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<Calculation> calculationList;
        try {
            calculationList = calculationService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the calculations");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", calculationList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Fetch calculation list by measuring device reading ID and month")
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
            @ApiResponse(responseCode = "404", description = "Calculation list not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the calculation list",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/calculations/readings/{measuringDeviceReadingId}/month/{month}", produces = "application/json")
    public ResponseEntity<?> fetchByDeviceReadingIdAndMonth(@PathVariable String measuringDeviceReadingId,
                                                            @PathVariable String month) {
        Map<String, Object> response = new HashMap<>();
        List<Calculation> foundCalculationList;
        if (!measuringDeviceReadingId.matches(ID_REGEXP)) {
            response.put("message", "There was an error while retrieving the calculation");
            response.put("details", List.of("Invalid ID"));
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        try {
            foundCalculationList = calculationService.findByMeasuringDeviceReadingIdAndMonth(
                    Long.parseLong(measuringDeviceReadingId), month);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while retrieving the calculation list");
            response.put("details", List.of("Calculation not found"));
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the calculation list");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundCalculationList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Fetch calculation list by measuring device reading ID and year")
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
            @ApiResponse(responseCode = "404", description = "Calculation list not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the calculation list",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/calculations/readings/{measuringDeviceReadingId}/year/{year}", produces = "application/json")
    public ResponseEntity<?> fetchByDeviceReadingIdAndYear(@PathVariable String measuringDeviceReadingId,
                                                           @PathVariable String year) {
        Map<String, Object> response = new HashMap<>();
        List<Calculation> foundCalculationList;
        if (!measuringDeviceReadingId.matches(ID_REGEXP)) {
            response.put("message", "There was an error while retrieving the calculation");
            response.put("details", List.of("Invalid ID"));
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        try {
            foundCalculationList = calculationService.findByMeasuringDeviceReadingIdAndYear(
                    Long.parseLong(measuringDeviceReadingId), year);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while retrieving the calculation list");
            response.put("details", List.of("Calculation not found"));
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the calculation list");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundCalculationList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get calculation by measuring device reading ID, month and year")
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
            @ApiResponse(responseCode = "404", description = "Calculation not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the calculation",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/calculations/readings/{measuringDeviceReadingId}/month/{month}/year/{year}",
            produces = "application/json")
    public ResponseEntity<?> getOneByDeviceReadingIdMonthAndYear(@PathVariable String measuringDeviceReadingId,
                                                                 @PathVariable String month,
                                                                 @PathVariable String year) {
        Map<String, Object> response = new HashMap<>();
        Calculation foundCalculation;
        if (!measuringDeviceReadingId.matches(ID_REGEXP)) {
            response.put("message", "There was an error while retrieving the calculation");
            response.put("details", List.of("Invalid ID"));
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        try {
            foundCalculation = calculationService.findByMeasuringDeviceReadingIdAndMonthAndYear(
                            Long.parseLong(measuringDeviceReadingId), month, year)
                    .orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while retrieving the calculation");
            response.put("details", List.of("Calculation not found"));
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the calculation");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundCalculation);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
