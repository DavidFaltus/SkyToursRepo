package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.ReservationItem;
import org.example.spolecnyprojektuhk.model.ReservationItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pro přístup k položkám rezervací.
 */
@Repository
public interface ReservationItemRepository extends JpaRepository<ReservationItem, ReservationItemId> {
    List<ReservationItem> findByReservationId(Long reservationId);
    Optional<ReservationItem> findByReservationIdAndTripId(Long reservationId, Long tripId);
}