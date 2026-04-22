package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ReservationItemDetailsDto {
    private Long tripId;
    private String tripName;
    private String tripDescription;
    private BigDecimal unitPrice;
    private int quantity;
    private Map<String, Object> tripSpecs;
    private Integer rating;
    private String review;

    public ReservationItemDetailsDto() {}

    public Long getTripId() {
        return tripId;
    }
    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public String getTripName() {
        return tripName;
    }
    public void setTripName(String tripName) {
        this.tripName = tripName;
    }

    public String getTripDescription() {
        return tripDescription;
    }
    public void setTripDescription(String tripDescription) {
        this.tripDescription = tripDescription;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Map<String, Object> getTripSpecs() {
        return tripSpecs;
    }
    public void setTripSpecs(Map<String, Object> tripSpecs) {
        this.tripSpecs = tripSpecs;
    }

    public Integer getRating() {
        return rating;
    }
    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }
    public void setReview(String review) {
        this.review = review;
    }
}
