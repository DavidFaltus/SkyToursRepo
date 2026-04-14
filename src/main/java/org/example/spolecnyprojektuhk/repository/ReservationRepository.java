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
    List<Reservation> findByUserId(Long userId);
    Optional<Reservation> findByUserAndStatus(AppUser user, String status);
    List<Reservation> findByUserAndStatusIsNot(AppUser user, String status);
    List<Reservation> findByStatusIsNot(String status);
}
