package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Calculation Service Tests")
class CalculationServiceTest {

    private final CalculationService calculationService = new CalculationService();

    @Nested
    @DisplayName("Consumption Calculation Tests")
    class ConsumptionCalculationTests {

        @Test
        @DisplayName("Should calculate consumption correctly")
        void shouldCalculateConsumptionCorrectly() {
            // Arrange
            BigDecimal currentReading = new BigDecimal("11110");
            BigDecimal previousReading = new BigDecimal("11095");

            // Act
            BigDecimal consumption = calculationService.calculateConsumption(currentReading, previousReading);

            // Assert
            assertEquals(new BigDecimal("15"), consumption);
        }

        @Test
        @DisplayName("Should throw exception when current reading is less than previous")
        void shouldThrowExceptionWhenCurrentLessThanPrevious() {
            // Arrange
            BigDecimal currentReading = new BigDecimal("11095");
            BigDecimal previousReading = new BigDecimal("11110");

            // Act & Assert
            assertThrows(DomainException.class, () ->
                    calculationService.calculateConsumption(currentReading, previousReading));
        }

        @Test
        @DisplayName("Should throw exception when readings are null")
        void shouldThrowExceptionWhenReadingsAreNull() {
            assertThrows(DomainException.class, () ->
                    calculationService.calculateConsumption(null, new BigDecimal("11095")));
        }
    }

    @Nested
    @DisplayName("Unit Value Calculation Tests")
    class UnitValueCalculationTests {

        @Test
        @DisplayName("Should calculate unit value correctly")
        void shouldCalculateUnitValueCorrectly() {
            // Arrange
            BigDecimal totalAmount = new BigDecimal("475");
            BigDecimal totalConsumption = new BigDecimal("584");

            // Act
            BigDecimal unitValue = calculationService.calculateUnitValue(totalAmount, totalConsumption);

            // Assert
            assertEquals(new BigDecimal("0.81"), unitValue);
        }

        @Test
        @DisplayName("Should throw exception when consumption is zero")
        void shouldThrowExceptionWhenConsumptionIsZero() {
            // Arrange
            BigDecimal totalAmount = new BigDecimal("475");
            BigDecimal totalConsumption = BigDecimal.ZERO;

            // Act & Assert
            assertThrows(DomainException.class, () ->
                    calculationService.calculateUnitValue(totalAmount, totalConsumption));
        }
    }

    @Nested
    @DisplayName("Tenant Amount Calculation Tests")
    class TenantAmountCalculationTests {

        @Test
        @DisplayName("Should calculate tenant amount correctly")
        void shouldCalculateTenantAmountCorrectly() {
            // Arrange
            BigDecimal consumption = new BigDecimal("15");
            BigDecimal unitValue = new BigDecimal("0.81");

            // Act
            BigDecimal tenantAmount = calculationService.calculateTenantAmount(consumption, unitValue);

            // Assert
            assertEquals(new BigDecimal("12.15"), tenantAmount);
        }
    }

    @Nested
    @DisplayName("Settlement Generation Tests")
    class SettlementGenerationTests {

        @Test
        @DisplayName("Should generate settlement correctly")
        void shouldGenerateSettlementCorrectly() {
            // Arrange
            String receiptId = "receipt-123";
            String tenantId = "tenant-456";
            BigDecimal consumption = new BigDecimal("15");
            BigDecimal unitValue = new BigDecimal("0.81");

            // Act
            Settlement settlement = calculationService.generateSettlement(receiptId, tenantId, consumption, unitValue);

            // Assert
            assertNotNull(settlement);
            assertEquals(receiptId, settlement.getReceiptId());
            assertEquals(tenantId, settlement.getTenantId());
            assertEquals(consumption, settlement.getConsumption());
            assertEquals(unitValue, settlement.getUnitValue());
            assertEquals(new BigDecimal("12.15"), settlement.getCalculatedAmount());
            assertEquals(new BigDecimal("0.00"), settlement.getAdjustmentAmount());
            assertEquals(new BigDecimal("12.15"), settlement.getFinalAmount());
        }
    }
}
