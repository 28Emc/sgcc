package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Settlement Entity Tests")
class SettlementTest {

    @Nested
    @DisplayName("Settlement Creation Tests")
    class SettlementCreationTests {

        @Test
        @DisplayName("Should create settlement correctly")
        void shouldCreateSettlementCorrectly() {
            // Arrange
            String receiptId = "receipt-123";
            String tenantId = "tenant-456";
            BigDecimal consumption = new BigDecimal("15");
            BigDecimal unitValue = new BigDecimal("0.81");
            BigDecimal calculatedAmount = new BigDecimal("12.15");

            // Act
            Settlement settlement = new Settlement(receiptId, tenantId, consumption, unitValue, calculatedAmount);

            // Assert
            assertNotNull(settlement);
            assertEquals(receiptId, settlement.getReceiptId());
            assertEquals(tenantId, settlement.getTenantId());
            assertEquals(consumption, settlement.getConsumption());
            assertEquals(unitValue, settlement.getUnitValue());
            assertEquals(calculatedAmount, settlement.getCalculatedAmount());
            assertEquals(new BigDecimal("0.00"), settlement.getAdjustmentAmount());
            assertEquals(calculatedAmount, settlement.getFinalAmount());
        }

        @Test
        @DisplayName("Should throw exception when receipt ID is blank")
        void shouldThrowExceptionWhenReceiptIdIsBlank() {
            assertThrows(DomainException.class, () ->
                    new Settlement("", "tenant-456", new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15")));
        }

        @Test
        @DisplayName("Should throw exception when tenant ID is blank")
        void shouldThrowExceptionWhenTenantIdIsBlank() {
            assertThrows(DomainException.class, () ->
                    new Settlement("receipt-123", "", new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15")));
        }
    }

    @Nested
    @DisplayName("Adjustment Tests")
    class AdjustmentTests {

        @Test
        @DisplayName("Should apply adjustment correctly")
        void shouldApplyAdjustmentCorrectly() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act
            settlement.applyAdjustment(new BigDecimal("-0.15"), "Ajuste de redondeo");

            // Assert
            assertEquals(new BigDecimal("-0.15"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.00"), settlement.getFinalAmount());
        }

        @Test
        @DisplayName("Should throw exception when adjustment reason is blank")
        void shouldThrowExceptionWhenAdjustmentReasonIsBlank() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act & Assert
            assertThrows(DomainException.class, () ->
                    settlement.applyAdjustment(new BigDecimal("-0.15"), ""));
        }

        @Test
        @DisplayName("Should throw exception when adjustment makes final amount negative")
        void shouldThrowExceptionWhenAdjustmentMakesFinalAmountNegative() {
            // Arrange
            Settlement settlement = new Settlement("receipt-123", "tenant-456",
                    new BigDecimal("15"), new BigDecimal("0.81"), new BigDecimal("12.15"));

            // Act & Assert
            assertThrows(DomainException.class, () ->
                    settlement.applyAdjustment(new BigDecimal("-15.00"), "Excesivo"));
        }
    }
}
