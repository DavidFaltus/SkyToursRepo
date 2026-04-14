package org.example.spolecnyprojektuhk.dto;

public class UpdateOrderStatusRequest {
    private String newStatus;

    public UpdateOrderStatusRequest() {}

    public String getNewStatus() {
        return newStatus;
    }
    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }
}
