package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.PassengerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pro přístup k profilům pasažérů.
 */
@Repository
public interface PassengerProfileRepository extends JpaRepository<PassengerProfile, Long> {
    Optional<PassengerProfile> findByUserId(Long userId);
}