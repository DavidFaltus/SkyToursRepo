package org.example.spolecnyprojektuhk.dto;

import java.util.List;

public class CreateReservationRequest {

    private Long userId;
    private List<ReservationItemRequest> items;

    public CreateReservationRequest() {}

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ReservationItemRequest> getItems() {
        return items;
    }
    public void setItems(List<ReservationItemRequest> items) {
        this.items = items;
    }
}