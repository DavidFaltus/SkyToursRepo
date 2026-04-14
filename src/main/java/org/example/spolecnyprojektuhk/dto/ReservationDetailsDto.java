package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ReservationDetailsDto {
    private Long id;
    private String username;
    private String userEmail;
    private LocalDateTime reservationDate;
    private BigDecimal totalPrice;
    private String status;
    private List<ReservationItemDetailsDto> items;

    public ReservationDetailsDto() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }
    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public List<ReservationItemDetailsDto> getItems() {
        return items;
    }
    public void setItems(List<ReservationItemDetailsDto> items) {
        this.items = items;
    }
}
