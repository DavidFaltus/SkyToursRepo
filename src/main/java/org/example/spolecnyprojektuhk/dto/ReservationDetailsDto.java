package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ReservationDetailsDto {
    private Long id;
    private String username; // Jméno uživatele, který rezervaci vytvořil
    private String userEmail; // Email uživatele
    private LocalDateTime reservationDate;
    private BigDecimal totalPrice;
    private String status;
    private List<ReservationItemDetailsDto> items;

    public ReservationDetailsDto() {}

    /**
     * getId
     * Vrací ID rezervace.
     */
    public Long getId() {
        return id;
    }

    /**
     * setId
     * Nastavuje ID rezervace.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getUsername
     * Vrací uživatelské jméno tvůrce rezervace.
     */
    public String getUsername() {
        return username;
    }

    /**
     * setUsername
     * Nastavuje uživatelské jméno tvůrce rezervace.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * getUserEmail
     * Vrací email uživatele.
     */
    public String getUserEmail() {
        return userEmail;
    }

    /**
     * setUserEmail
     * Nastavuje email uživatele.
     */
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    /**
     * getReservationDate
     * Vrací datum a čas vytvoření rezervace.
     */
    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    /**
     * setReservationDate
     * Nastavuje datum a čas vytvoření rezervace.
     */
    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    /**
     * getTotalPrice
     * Vrací celkovou cenu rezervace.
     */
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    /**
     * setTotalPrice
     * Nastavuje celkovou cenu rezervace.
     */
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    /**
     * getStatus
     * Vrací stav rezervace.
     */
    public String getStatus() {
        return status;
    }

    /**
     * setStatus
     * Nastavuje stav rezervace.
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * getItems
     * Vrací seznam položek rezervace.
     */
    public List<ReservationItemDetailsDto> getItems() {
        return items;
    }

    /**
     * setItems
     * Nastavuje seznam položek rezervace.
     */
    public void setItems(List<ReservationItemDetailsDto> items) {
        this.items = items;
    }
}
