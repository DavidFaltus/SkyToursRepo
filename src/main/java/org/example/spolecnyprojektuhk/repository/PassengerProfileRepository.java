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

    /**
     * Získá profil podle ID uživatele.
     * @param userId ID uživatele
     * @return Profil pasažéra, pokud existuje
     */
    Optional<PassengerProfile> findByUserId(Long userId);
}