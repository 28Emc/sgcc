package com.sgcc.sgccapi.enums;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Pattern;

public class CustomDateValidator implements
        ConstraintValidator<CustomDateConstraint, String> {

    private static final String DATE_FORMAT = "yyyy-MM-dd";
    private static final Pattern DATE_PATTERN = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

    @Override
    public void initialize(CustomDateConstraint customDate) {
    }

    @Override
    public boolean isValid(String customDateField,
                           ConstraintValidatorContext cxt) {
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        if (customDateField == null || !DATE_PATTERN.matcher(customDateField).matches()) {
            return false;
        }
        try {
            sdf.setLenient(false);
            Date d = sdf.parse(customDateField);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }
}