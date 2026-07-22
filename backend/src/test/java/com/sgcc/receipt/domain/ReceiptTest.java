package com.sgcc.receipt.domain;

import com.sgcc.shared.domain.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Receipt Entity Tests")
class ReceiptTest {

    @Nested
    @DisplayName("Receipt Creation Tests")
    class ReceiptCreationTests {

        @Test
        @DisplayName("Should create receipt correctly")
        void shouldCreateReceiptCorrectly() {
            // Arrange
            String serviceId = "service-123";
            String period = "2024-01";
            String receiptNumber = "REC-001";
            BigDecimal totalAmount = new BigDecimal("475");
            BigDecimal totalConsumption = new BigDecimal("584");

            // Act
            Receipt receipt = new Receipt(serviceId, period, receiptNumber, totalAmount, totalConsumption);

            // Assert
            assertNotNull(receipt);
            assertEquals(serviceId, receipt.getServiceId());
            assertEquals(period, receipt.getPeriod());
            assertEquals(receiptNumber, receipt.getReceiptNumber());
            assertEquals(totalAmount, receipt.getTotalAmount());
            assertEquals(totalConsumption, receipt.getTotalConsumption());
        }

        @Test
        @DisplayName("Should throw exception when service ID is blank")
        void shouldThrowExceptionWhenServiceIdIsBlank() {
            assertThrows(DomainException.class, () ->
                    new Receipt("", "2024-01", "REC-001", new BigDecimal("475"), new BigDecimal("584")));
        }

        @Test
        @DisplayName("Should throw exception when total consumption is zero")
        void shouldThrowExceptionWhenTotalConsumptionIsZero() {
            assertThrows(DomainException.class, () ->
                    new Receipt("service-123", "2024-01", "REC-001", new BigDecimal("475"), BigDecimal.ZERO));
        }
    }

    @Nested
    @DisplayName("Unit Value Calculation Tests")
    class UnitValueCalculationTests {

        @Test
        @DisplayName("Should calculate unit value correctly")
        void shouldCalculateUnitValueCorrectly() {
            // Arrange
            Receipt receipt = new Receipt("service-123", "2024-01", "REC-001",
                    new BigDecimal("475"), new BigDecimal("584"));

            // Act
            BigDecimal unitValue = receipt.calculateUnitValue();

            // Assert
            assertEquals(new BigDecimal("0.81"), unitValue);
        }

        @Test
        @DisplayName("Should throw exception when consumption is zero")
        void shouldThrowExceptionWhenConsumptionIsZero() {
            // Arrange
            Receipt receipt = new Receipt("service-123", "2024-01", "REC-001",
                    new BigDecimal("475"), BigDecimal.ZERO);

            // Act & Assert
            assertThrows(DomainException.class, receipt::calculateUnitValue);
        }
    }
}
