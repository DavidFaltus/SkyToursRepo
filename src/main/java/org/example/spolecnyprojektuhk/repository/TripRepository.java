package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pro přístup k letům.
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCategoryId(Long categoryId);
}