package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.dto.ReservationSummaryViewDto;
import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository pro přístup k hlavičkám rezervací.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    //METODY PRO PRÁCI BEZ VNITŘNÍHO POHLEDU V DATABÁZI
    List<Reservation> findByUserId(Long userId);
    Optional<Reservation> findByUserAndStatus(AppUser user, String status);
    List<Reservation> findByUserAndStatusIsNot(AppUser user, String status);
    List<Reservation> findByStatusIsNot(String status);

    //VOLÁNÍ POHLEDU PRO SUMMARY REZERVACÍ
    @Query(value = "SELECT reservation_id AS reservationId, username, reservation_date AS reservationDate, status, total_price AS totalPrice, items_count AS itemsCount FROM v_reservation_summary", nativeQuery = true)
    List<ReservationSummaryViewDto> getReservationSummaryFromView();

    //VOLÁNÍ DB FUNKCE PRO KALKULACI CEN V KOŠÍKU
    @Query(value = "SELECT calculate_total_price(:reservationId)", nativeQuery = true)
    BigDecimal calculateTotalPriceFunction(@Param("reservationId") Integer reservationId);

    //VOLÁNÍ PROCEDURY sp_update_reservation_status
    @Procedure(procedureName = "sp_update_reservation_status")
    void updateReservationStatusProcedure(@Param("p_reservation_id") Integer pReservationId, @Param("p_new_status") String pNewStatus);

    @Procedure(procedureName = "sp_create_reservation")
    void createReservationProcedure(@Param("p_user_id") Integer pUserId, @Param("p_trip_id") Integer pTripId, @Param("p_quantity") Integer pQuantity, @Param("p_status") String pStatus);
}
