package org.example.spolecnyprojektuhk.dto;

import java.util.List;

/**
 * DTO přijímající data z frontendu při vytváření nové rezervace.
 */
public class CreateReservationRequest {

    private Long userId; // Kdo rezervaci dělá (později bude nahrazeno ID z JWT tokenu)
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