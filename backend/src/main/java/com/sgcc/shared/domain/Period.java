package com.sgcc.shared.domain;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Objects;

public class Period {

    private final YearMonth yearMonth;

    public Period(YearMonth yearMonth) {
        if (yearMonth == null) {
            throw new IllegalArgumentException("YearMonth cannot be null");
        }
        this.yearMonth = yearMonth;
    }

    public static Period of(int year, int month) {
        return new Period(YearMonth.of(year, month));
    }

    public static Period from(LocalDate date) {
        return new Period(YearMonth.from(date));
    }

    public static Period current() {
        return new Period(YearMonth.now());
    }

    public YearMonth getYearMonth() {
        return yearMonth;
    }

    public int getYear() {
        return yearMonth.getYear();
    }

    public int getMonth() {
        return yearMonth.getMonthValue();
    }

    public String format() {
        return yearMonth.getYear() + "-" + String.format("%02d", yearMonth.getMonthValue());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Period period = (Period) o;
        return Objects.equals(yearMonth, period.yearMonth);
    }

    @Override
    public int hashCode() {
        return Objects.hash(yearMonth);
    }

    @Override
    public String toString() {
        return format();
    }
}
