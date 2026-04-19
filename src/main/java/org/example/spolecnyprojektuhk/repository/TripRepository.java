package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Trip;
import org.example.spolecnyprojektuhk.dto.TripDetailsViewDto;
import org.example.spolecnyprojektuhk.dto.TripRatingViewDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pro přístup k letům.
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCategoryId(Long categoryId);

    //VOLÁNÍ POHLEDUZ DATABÁZE
    @Query(value = "SELECT trip_id AS tripId, trip_name AS tripName, category_name AS categoryName, departure_city AS departureCity, price, CAST(specs AS text) AS specs FROM v_trip_details", nativeQuery = true)
    List<TripDetailsViewDto> getAllTripsFromView();

    //VOLÁNÍ POHLEDU PRO HODNOCENÍ
    @Query(value = "SELECT trip_id AS tripId, trip_name AS tripName, average_rating AS averageRating, review_count AS reviewCount FROM v_trip_ratings", nativeQuery = true)
    List<TripRatingViewDto> getTripRatingsFromView();

    @Query(value = "SELECT trip_id AS tripId, trip_name AS tripName, price, null AS categoryName, null AS departureCity, null AS specs FROM get_trips_under_price(:maxPrice)", nativeQuery = true)
    List<TripDetailsViewDto> getTripsUnderPrice(@Param("maxPrice") java.math.BigDecimal maxPrice);
}
