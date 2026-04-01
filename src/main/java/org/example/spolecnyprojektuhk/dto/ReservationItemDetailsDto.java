package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ReservationItemDetailsDto {
    private Long tripId;
    private String tripName;
    private String tripDescription;
    private BigDecimal unitPrice;
    private int quantity;
    private Map<String, Object> tripSpecs; // Pro zobrazení specifik letu

    public ReservationItemDetailsDto() {}

    /**
     * getTripId
     * Vrací ID letu.
     */
    public Long getTripId() {
        return tripId;
    }

    /**
     * setTripId
     * Nastavuje ID letu.
     */
    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    /**
     * getTripName
     * Vrací název letu.
     */
    public String getTripName() {
        return tripName;
    }

    /**
     * setTripName
     * Nastavuje název letu.
     */
    public void setTripName(String tripName) { // Opraveno: odstraněno duplicitní 'String'
        this.tripName = tripName;
    }

    /**
     * getTripDescription
     * Vrací popis letu.
     */
    public String getTripDescription() {
        return tripDescription;
    }

    /**
     * setTripDescription
     * Nastavuje popis letu.
     */
    public void setTripDescription(String tripDescription) {
        this.tripDescription = tripDescription;
    }

    /**
     * getUnitPrice
     * Vrací jednotkovou cenu letu.
     */
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    /**
     * setUnitPrice
     * Nastavuje jednotkovou cenu letu.
     */
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    /**
     * getQuantity
     * Vrací množství.
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * setQuantity
     * Nastavuje množství.
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * getTripSpecs
     * Vrací specifikace letu.
     */
    public Map<String, Object> getTripSpecs() {
        return tripSpecs;
    }

    /**
     * setTripSpecs
     * Nastavuje specifikace letu.
     */
    public void setTripSpecs(Map<String, Object> tripSpecs) {
        this.tripSpecs = tripSpecs;
    }
}
