package com.sgcc.shared.domain;

import java.util.Objects;
import java.util.UUID;

public class Identifier {

    private final String value;

    public Identifier(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Identifier value cannot be null or blank");
        }
        this.value = value;
    }

    public static Identifier generate() {
        return new Identifier(UUID.randomUUID().toString());
    }

    public static Identifier from(String value) {
        return new Identifier(value);
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Identifier that = (Identifier) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
