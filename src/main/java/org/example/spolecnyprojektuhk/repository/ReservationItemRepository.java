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

    /**
     * findByReservationId
     * Získá všechny položky (lety) pro danou hlavičku rezervace.
     */
    List<ReservationItem> findByReservationId(Long reservationId);

    /**
     * findByReservationIdAndTripId
     * Najde položku rezervace podle ID rezervace a ID letu.
     */
    Optional<ReservationItem> findByReservationIdAndTripId(Long reservationId, Long tripId);
}