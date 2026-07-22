package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Adjustment Tests")
class AdjustmentTest {

    @Nested
    @DisplayName("Manual Adjustment Tests")
    class ManualAdjustmentTests {

        @Test
        @DisplayName("Should apply positive adjustment")
        void shouldApplyPositiveAdjustment() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act
            settlement.applyAdjustment(new BigDecimal("0.50"), "Ajuste por diferencia de redondeo");

            // Assert
            assertEquals(new BigDecimal("0.50"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.65"), settlement.getFinalAmount());
        }

        @Test
        @DisplayName("Should apply negative adjustment")
        void shouldApplyNegativeAdjustment() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act
            settlement.applyAdjustment(new BigDecimal("-0.15"), "Ajuste voluntario");

            // Assert
            assertEquals(new BigDecimal("-0.15"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.00"), settlement.getFinalAmount());
        }

        @Test
        @DisplayName("Should accumulate multiple adjustments")
        void shouldAccumulateMultipleAdjustments() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act
            settlement.applyAdjustment(new BigDecimal("0.50"), "Primer ajuste");
            settlement.applyAdjustment(new BigDecimal("-0.25"), "Segundo ajuste");

            // Assert
            assertEquals(new BigDecimal("0.25"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.40"), settlement.getFinalAmount());
        }

        @Test
        @DisplayName("Should preserve original calculated amount")
        void shouldPreserveOriginalCalculatedAmount() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act
            settlement.applyAdjustment(new BigDecimal("-0.15"), "Ajuste");

            // Assert
            assertEquals(new BigDecimal("12.15"), settlement.getCalculatedAmount());
            assertEquals(new BigDecimal("-0.15"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.00"), settlement.getFinalAmount());
        }
    }
}
