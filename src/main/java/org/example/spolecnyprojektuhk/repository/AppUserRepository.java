package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pro přístup k datům entity AppUser (tabulka app_user).
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Najde uživatele podle uživatelského jména (přihlašování).
     * @param username Přihlašovací jméno
     * @return Uživatel, pokud existuje
     */
    Optional<AppUser> findByUsername(String username);

    /**
     * Najde uživatele podle e-mailu.
     * @param email E-mailová adresa
     * @return Uživatel, pokud existuje
     */
    Optional<AppUser> findByEmail(String email);
}