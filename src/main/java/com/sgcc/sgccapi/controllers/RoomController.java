package com.sgcc.sgccapi.controllers;

import com.sgcc.sgccapi.models.dtos.RoomDTO;
import com.sgcc.sgccapi.models.entities.Room;
import com.sgcc.sgccapi.services.IRoomService;
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

@Tag(name = "Room", description = "Room operations")
@CrossOrigin(origins = {"*", "http://localhost:4200"})
@RestController
@AllArgsConstructor
public class RoomController {
    private final IRoomService roomService;

    @Operation(summary = "Fetch room list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityListSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the rooms",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/rooms", produces = "application/json")
    public ResponseEntity<?> fetchAll() {
        Map<String, Object> response = new HashMap<>();
        List<Room> roomList;
        try {
            roomList = roomService.findAll();
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the rooms");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", roomList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get room by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid room ID",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Room not found",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while retrieving the room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @GetMapping(value = "/rooms/{roomId}", produces = "application/json")
    public ResponseEntity<?> getOne(@PathVariable String roomId) {
        Map<String, Object> response = new HashMap<>();
        Room foundRoom;
        try {
            foundRoom = roomService.findById(Long.parseLong(roomId)).orElseThrow();
        } catch (NoSuchElementException e) {
            response.put("message", "Room not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            response.put("message", "There was an error while retrieving the room");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Data found");
        response.put("details", foundRoom);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Register a room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Room registered successfully", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
            }),
            @ApiResponse(responseCode = "400", description = "Room already exists / " +
                    "There was an error while registering the room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "500", description = "There was an error while registering the room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PostMapping(value = "/rooms", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody RoomDTO roomDTO, BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while registering the room");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            roomService.create(roomDTO);
        } catch (BadRequestException e) {
            response.put("message", "There was an error while registering the room");
            response.put("details", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("message", "There was an error while registering the room");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The room was registered successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Modify room values")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Room updated successfully", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityObjectSchema"))
            }),
            @ApiResponse(responseCode = "400", description = "Room already exists / " +
                    "There was an error while updating the room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    }),
            @ApiResponse(responseCode = "404", description = "Room not found", content = {
                    @Content(mediaType = APPLICATION_JSON_VALUE,
                            schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
            }),
            @ApiResponse(responseCode = "500", description = "There was an error while updating the room",
                    content = {
                            @Content(mediaType = APPLICATION_JSON_VALUE,
                                    schema = @Schema(ref = "#/components/schemas/responseEntityErrorSchema"))
                    })
    })
    @PutMapping(value = "/rooms/{roomId}", produces = "application/json")
    public ResponseEntity<?> updateValue(@Valid @RequestBody RoomDTO roomDTO, BindingResult result,
                                         @PathVariable String roomId) {
        Map<String, Object> response = new HashMap<>();
        Room foundRoom;
        try {
            foundRoom = roomService.findById(Long.parseLong(roomId)).orElseThrow();
            if (result.hasErrors()) {
                List<String> errors = new ArrayList<>();
                for (FieldError fieldError : result.getFieldErrors()) {
                    errors.add(fieldError.getDefaultMessage());
                }
                response.put("message", "There was an error while updating room values");
                response.put("details", errors);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else if (roomService.findByRoomNumber(roomDTO.getRoomNumber()).isPresent() &&
                    !foundRoom.getRoomNumber().equals(roomDTO.getRoomNumber())) {
                response.put("message", "Room already exists");
                response.put("details", List.of());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            roomService.update(Long.parseLong(roomId), roomDTO);
        } catch (NoSuchElementException e) {
            response.put("message", "Room not found");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            response.put("message", "There was an error while updating room values");
            response.put("details", List.of());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "The room was updated successfully");
        response.put("details", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
