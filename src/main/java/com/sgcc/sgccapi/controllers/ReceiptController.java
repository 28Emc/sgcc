package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.dtos.PaymentCalculationDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptDTO;
import com.sgcc.sgccapi.models.dtos.ReceiptMeasuringDeviceDTO;
import com.sgcc.sgccapi.models.entities.Calculation;
import com.sgcc.sgccapi.models.entities.Receipt;
import com.sgcc.sgccapi.services.IReceiptService;
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

@Tag(name = "Receipt", description = "Receipt operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class ReceiptController {
    private final IReceiptService receiptService;

    @Operation(summary = "Fetch receipt list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the receipts",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/receipts", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<Receipt> receiptList;
        try {
            receiptList = receiptService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the receipts");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", receiptList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Fetch receipt list by year")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the receipts by year",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/receipts/year/{year}", produces = "application/json")
    public ResponseEntity<?> fetchAllByYear(@PathVariable String year) {
        Map<String, Object> response = new HashMap<>();
        List<Receipt> receiptList;
        try {
            receiptList = receiptService.findByYear(year);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the receipts by year");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", receiptList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get receipt by month")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid receipt month",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Receipt not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the receipt by month",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/receipts/month/{month}", produces = "application/json")
    public ResponseEntity<?> getOneByMonth(@PathVariable String month) {
        Map<String, Object> response = new HashMap<>();
        Receipt foundReceipt;
        try {
            foundReceipt = receiptService.findByMonth(month).orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Receipt not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the receipt by month");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundReceipt);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get receipt by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid receipt ID",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Receipt not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while retrieving the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/receipts/{receiptId}", produces = "application/json")
    public ResponseEntity<?> getOne(@PathVariable String receiptId) {
        Map<String, Object> response = new HashMap<>();
        Receipt foundReceipt;
        try {
            foundReceipt = receiptService.findById(receiptId).orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Receipt not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the receipt");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundReceipt);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Register a receipt")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Receipt registered successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Receipt already exists / " +
                    "There was an error while registering the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while registering the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/receipts", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody ReceiptDTO receiptDTO, BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the receipt");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            receiptService.create(receiptDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the receipt");
            response.put("details", List.of(e.getMessage()));
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the receipt");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The receipt was registered successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*@Operation(summary = "Register a receipt and calculate payment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Receipt registered successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Receipt already exists / " +
                    "There was an error while registering the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while registering the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/receipts/payment", produces = "application/json")
    public ResponseEntity<?> registerAndCalculatePayment(
            @Valid @RequestBody PaymentCalculationDTO paymentCalculationDTO, BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Calculation calculation = null;
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the receipt and calculate the payment");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            calculation = receiptService.registerAndCalculatePayment(paymentCalculationDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the receipt and calculate the payment");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the receipt and calculate the payment");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The receipt was registered and the payment was calculated successfully");
        response.put("details", calculation);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }*/

    @Operation(summary = "Modify receipt values")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Receipt updated successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Receipt already exists / " +
                    "There was an error while updating the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Receipt not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while updating the receipt",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/receipts/{receiptId}", produces = "application/json")
    public ResponseEntity<?> updateValue(@Valid @RequestBody ReceiptDTO receiptDTO,
                                         BindingResult result, @PathVariable String receiptId) {
        Map<String, Object> response = new HashMap<>();
        Receipt foundReceipt;
        try {
            foundReceipt = receiptService.findById(receiptId).orElseThrow();
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while updating receipt values");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else if (receiptService.findByMonthAndYear(receiptDTO.getMonthNumber(),
                    receiptDTO.getYearNumber()).isPresent() &&
                    !(foundReceipt.getMonth().equals(receiptDTO.getMonthNumber()) ||
                            foundReceipt.getYear().equals(receiptDTO.getYearNumber()))) {
                response.put("message", "Receipt already exists");
                response.put("details", List.of());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            receiptService.update(receiptId, receiptDTO);
        } catch (NoSuchElementException | BadRequestException e) {
            response.put("message", "There was an error while updating receipt values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while updating receipt values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The receipt was updated successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Add receipt to measuring device")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Receipt added to measuring device successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while adding receipt to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Receipt or measuring device not found / " +
                    "Receipt already added to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while adding receipt to measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/receipts/measuring-devices/add", produces = "application/json")
    public ResponseEntity<?> addReceiptToMeasuringDevice(
            @Valid @RequestBody ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while adding receipt to measuring device");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            receiptService.addReceiptToMeasuringDevice(receiptMeasuringDeviceDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while adding receipt to measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while adding receipt to measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while adding receipt to measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Receipt added to measuring device successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Delete receipt from measuring device")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Receipt deleted from measuring device successfully",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400",
                    description = "There was an error while deleting receipt from measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Receipt or measuring device not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500",
                    description = "There was an error while deleting receipt from measuring device",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/receipt/measuring-devices/delete", produces = "application/json")
    public ResponseEntity<?> deleteReceiptFromMeasuringDevice(
            @Valid @RequestBody ReceiptMeasuringDeviceDTO receiptMeasuringDeviceDTO,
            BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while deleting receipt from measuring device");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            receiptService.deleteReceiptFromMeasuringDevice(receiptMeasuringDeviceDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "There was an error while deleting receipt from measuring device");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while deleting receipt from measuring device");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Receipt deleted from measuring device successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
