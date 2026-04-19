package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.PassengerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pro přístup k profilům pasažérů.
 */
@Repository
public interface PassengerProfileRepository extends JpaRepository<PassengerProfile, Long> {
    //METODY PRO PRÁCI BEZ VNITŘNÍHO POHLEDU V DATABÁZI
    Optional<PassengerProfile> findByUserId(Long userId);

    //VYUŽITÍ FUNKCE Z DB
    @Query(value = "SELECT get_passenger_info(:userId)", nativeQuery = true)
    String getPassengerInfoFromDb(@Param("userId") Integer userId);
}
