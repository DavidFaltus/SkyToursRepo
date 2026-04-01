package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pro přístup k lokacím/letištím.
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}