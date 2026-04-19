package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ReservationSummaryViewDto {
    Long getReservationId();
    String getUsername();
    LocalDateTime getReservationDate();
    String getStatus();
    BigDecimal getTotalPrice();
    Integer getItemsCount();
}
