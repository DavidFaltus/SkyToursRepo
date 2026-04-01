package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pro přístup k hlavičkám rezervací.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * findByUserId
     * Vrátí seznam rezervací podle uživatele.
     */
    List<Reservation> findByUserId(Long userId);

    /**
     * findByUserAndStatus
     * Najde rezervaci podle uživatele a stavu.
     */
    Optional<Reservation> findByUserAndStatus(AppUser user, String status);

    /**
     * findByUserAndStatusIsNot
     * Najde seznam rezervací pro daného uživatele, které nemají zadaný stav.
     */
    List<Reservation> findByUserAndStatusIsNot(AppUser user, String status);

    /**
     * findByStatusIsNot
     * Najde seznam všech rezervací, které nemají zadaný stav.
     */
    List<Reservation> findByStatusIsNot(String status);
}
