package org.example.spolecnyprojektuhk.dto;

public class CartItemRequest {
    private Long tripId;
    private int quantity;

    public Long getTripId() {
        return tripId;
    }
    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}