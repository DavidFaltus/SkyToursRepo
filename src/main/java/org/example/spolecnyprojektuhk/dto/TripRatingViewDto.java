package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;

public interface TripRatingViewDto {
    Long getTripId();
    String getTripName();
    BigDecimal getAverageRating();
    Integer getReviewCount();
}
