package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.TripDto;
import org.example.spolecnyprojektuhk.dto.TripDetailsViewDto;
import org.example.spolecnyprojektuhk.dto.TripRatingViewDto;
import org.example.spolecnyprojektuhk.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*") // Vracím pro jistotu explicitní povolení pro Controller
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<TripDto>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/view")
    public ResponseEntity<List<TripDetailsViewDto>> getAllTripsFromView() {
        return ResponseEntity.ok(tripService.getAllTripsFromView());
    }

    @GetMapping("/ratings/view")
    public ResponseEntity<List<TripRatingViewDto>> getTripRatingsFromView() {
        return ResponseEntity.ok(tripService.getTripRatingsFromView());
    }

    @GetMapping("/under-price/{price}")
    public ResponseEntity<List<TripDetailsViewDto>> getTripsUnderPrice(@PathVariable BigDecimal price) {
        return ResponseEntity.ok(tripService.getTripsUnderPrice(price));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDto> getTripById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(tripService.getTripById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createTrip(@RequestBody TripDto tripDto) {
        try {
            TripDto created = tripService.createTrip(tripDto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException ex) {
            System.err.println("[TripController] Error creating trip: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @RequestBody TripDto tripDto) {
        try {
            TripDto updated = tripService.updateTrip(id, tripDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            System.err.println("[TripController] Error updating trip: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }
}
