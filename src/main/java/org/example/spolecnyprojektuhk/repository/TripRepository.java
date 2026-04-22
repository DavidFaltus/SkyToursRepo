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
    // OPRAVA: Přidán image_path a description do dotazu pro zobrazení fotek a popisu na hlavní stránce
    @Query(value = "SELECT t.id AS tripId, t.name AS tripName, c.name AS categoryName, l.city AS departureCity, t.price, CAST(t.specs AS text) AS specs, t.image_path AS imagePath, t.description AS description FROM trip t JOIN trip_category c ON t.category_id = c.id JOIN location l ON t.location_id = l.id", nativeQuery = true)
    List<TripDetailsViewDto> getAllTripsFromView();

    //VOLÁNÍ POHLEDU PRO HODNOCENÍ
    @Query(value = "SELECT trip_id AS tripId, trip_name AS tripName, average_rating AS averageRating, review_count AS reviewCount FROM v_trip_ratings", nativeQuery = true)
    List<TripRatingViewDto> getTripRatingsFromView();

    @Query(value = "SELECT trip_id AS tripId, trip_name AS tripName, price, null AS categoryName, null AS departureCity, null AS specs, null AS imagePath, null AS description FROM get_trips_under_price(:maxPrice)", nativeQuery = true)
    List<TripDetailsViewDto> getTripsUnderPrice(@Param("maxPrice") java.math.BigDecimal maxPrice);
}
