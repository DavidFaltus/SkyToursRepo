package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;

public interface TripDetailsViewDto {
    Long getTripId();
    String getTripName();
    String getCategoryName();
    String getDepartureCity();
    BigDecimal getPrice();
    String getSpecs(); // JPA vrátí JSONB jako String
}
