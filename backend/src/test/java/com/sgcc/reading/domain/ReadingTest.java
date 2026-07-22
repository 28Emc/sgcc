package com.sgcc.reading.domain;

import com.sgcc.shared.domain.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import java.math.BigDecimal;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Reading Entity Tests")
class ReadingTest {

    @Nested
    @DisplayName("Reading Creation Tests")
    class ReadingCreationTests {

        @Test
        @DisplayName("Should create reading correctly")
        void shouldCreateReadingCorrectly() {
            // Arrange
            String meterId = "meter-123";
            LocalDate readingDate = LocalDate.of(2024, 1, 15);
            BigDecimal readingValue = new BigDecimal("11110");

            // Act
            Reading reading = new Reading(meterId, readingDate, readingValue);

            // Assert
            assertNotNull(reading);
            assertEquals(meterId, reading.getMeterId());
            assertEquals(readingDate, reading.getReadingDate());
            assertEquals(readingValue, reading.getReadingValue());
        }

        @Test
        @DisplayName("Should throw exception when meter ID is blank")
        void shouldThrowExceptionWhenMeterIdIsBlank() {
            assertThrows(DomainException.class, () ->
                    new Reading("", LocalDate.now(), new BigDecimal("11110")));
        }

        @Test
        @DisplayName("Should throw exception when reading value is negative")
        void shouldThrowExceptionWhenReadingValueIsNegative() {
            assertThrows(DomainException.class, () ->
                    new Reading("meter-123", LocalDate.now(), new BigDecimal("-100")));
        }
    }

    @Nested
    @DisplayName("Consumption Calculation Tests")
    class ConsumptionCalculationTests {

        @Test
        @DisplayName("Should calculate consumption correctly")
        void shouldCalculateConsumptionCorrectly() {
            // Arrange
            Reading currentReading = new Reading("meter-123", LocalDate.of(2024, 1, 15), new BigDecimal("11110"));
            BigDecimal previousValue = new BigDecimal("11095");

            // Act
            BigDecimal consumption = currentReading.calculateConsumption(previousValue);

            // Assert
            assertEquals(new BigDecimal("15"), consumption);
        }

        @Test
        @DisplayName("Should throw exception when current reading is less than previous")
        void shouldThrowExceptionWhenCurrentLessThanPrevious() {
            // Arrange
            Reading currentReading = new Reading("meter-123", LocalDate.of(2024, 1, 15), new BigDecimal("11095"));
            BigDecimal previousValue = new BigDecimal("11110");

            // Act & Assert
            assertThrows(DomainException.class, () ->
                    currentReading.calculateConsumption(previousValue));
        }
    }
}
