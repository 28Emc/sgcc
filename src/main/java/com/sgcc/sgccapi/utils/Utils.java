package com.sgcc.sgccapi.utils;

import com.sgcc.sgccapi.models.entities.MeasuringDeviceReading;
import com.sgcc.sgccapi.models.entities.Receipt;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.Month;

public class Utils {
    public static String ID_REGEXP = "^\\d+$";

    public static int getCurrentMonth() {
        return LocalDateTime.now().getMonthValue();
    }

    public static int getPreviousMonth() {
        return LocalDateTime.now().minusMonths(1).getMonthValue();
    }

    public static int getCurrentYear() {
        return LocalDateTime.now().getYear();
    }

    public static int getPreviousYear() {
        return LocalDateTime.now().minusYears(1).getYear();
    }

    public static boolean isValidMonth(String monthString) {
        for (Month month : Month.values()) {
            if (Integer.parseInt(monthString) == month.getValue()) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidYear(String yearString) {
        DateFormat sdf = new SimpleDateFormat("yyyy");
        sdf.setLenient(false);
        try {
            sdf.parse(yearString);
        } catch (ParseException e) {
            return false;
        }
        return true;
    }

    public static BigDecimal calculateUnitPrice(Integer totalConsumption, BigDecimal totalPayment) {
        var unitPrice = totalPayment.doubleValue() / totalConsumption;
        return BigDecimal.valueOf(unitPrice).setScale(2, RoundingMode.HALF_EVEN);
    }

    public static BigDecimal calculateTotalPayment(MeasuringDeviceReading measuringDeviceReading, Receipt receipt) {
        double consumption;
        BigDecimal totalConsumptionPayment = BigDecimal.ZERO;
        if (measuringDeviceReading == null || receipt == null) {
            return totalConsumptionPayment;
        }
        consumption = measuringDeviceReading.getCurrentReading() - measuringDeviceReading.getPreviousReading();
        return BigDecimal.valueOf(consumption).multiply(receipt.getUnitPrice());
    }
}
