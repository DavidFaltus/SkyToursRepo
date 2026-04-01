package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.TripCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pro přístup ke kategoriím letů.
 */
@Repository
public interface TripCategoryRepository extends JpaRepository<TripCategory, Long> {
}