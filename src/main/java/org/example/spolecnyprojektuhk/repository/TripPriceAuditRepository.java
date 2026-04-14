package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.TripPriceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pro přístup k historii změn cen letů.
 */
@Repository
public interface TripPriceAuditRepository extends JpaRepository<TripPriceAudit, Long> {
    List<TripPriceAudit> findByTripIdOrderByChangedAtDesc(Long tripId);
}