package com.sgcc.shared.domain;

import java.util.Optional;
import java.util.List;

public interface Repository<T extends BaseEntity> {

    Optional<T> findById(Identifier id);

    List<T> findAll();

    T save(T entity);

    void delete(T entity);

    boolean existsById(Identifier id);
}
