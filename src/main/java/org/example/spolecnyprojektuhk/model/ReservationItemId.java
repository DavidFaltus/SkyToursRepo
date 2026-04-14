package org.example.spolecnyprojektuhk.model;

import java.io.Serializable;
import java.util.Objects;

public class ReservationItemId implements Serializable {

    private Long reservationId;
    private Long tripId;

    public ReservationItemId() {}

    public ReservationItemId(Long reservationId, Long tripId) {
        this.reservationId = reservationId;
        this.tripId = tripId;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReservationItemId that = (ReservationItemId) o;
        return Objects.equals(reservationId, that.reservationId) &&
               Objects.equals(tripId, that.tripId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reservationId, tripId);
    }
}