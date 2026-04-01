package org.example.spolecnyprojektuhk.dto;

public class UpdateOrderStatusRequest {
    private String newStatus;

    public UpdateOrderStatusRequest() {}

    /**
     * getNewStatus
     * Vrací nový stav objednávky.
     */
    public String getNewStatus() {
        return newStatus;
    }

    /**
     * setNewStatus
     * Nastavuje nový stav objednávky.
     */
    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }
}
