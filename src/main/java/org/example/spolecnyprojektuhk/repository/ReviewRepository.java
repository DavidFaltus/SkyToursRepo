package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    //HODNOCENÍ NEZASAHUJE MOMENTÁLNĚ DO DATABÁZE
    List<Review> findByTripId(Long tripId);
    Optional<Review> findByUserIdAndTripId(Long userId, Long tripId);
}