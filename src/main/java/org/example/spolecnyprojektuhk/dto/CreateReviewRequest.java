package org.example.spolecnyprojektuhk.dto;

/**
 * DTO přijímající data z frontendu při vytváření nové recenze k letu.
 */
public class CreateReviewRequest {

    private Long tripId;
    private Integer rating;
    private String comment;

    public CreateReviewRequest() {}

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}