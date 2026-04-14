package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pro přístup k hodnocením letů.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTripId(Long tripId);
}