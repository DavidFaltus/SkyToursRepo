package org.example.spolecnyprojektuhk.dto;

public class ReservationItemRequest {

    private Long tripId;
    private Integer quantity;

    public ReservationItemRequest() {}

    public Long getTripId() {
        return tripId;
    }
    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}