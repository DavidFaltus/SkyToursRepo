package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.LocationDto;
import org.example.spolecnyprojektuhk.model.Location;
import org.example.spolecnyprojektuhk.repository.LocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller pro správu a výpis lokací/letišť.
 */
@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    /**
     * Získá všechny dostupné lokace.
     * Metoda: GET /api/locations
     */
    @GetMapping
    public ResponseEntity<List<LocationDto>> getAllLocations() {
        List<LocationDto> locations = locationRepository.findAll().stream()
                .map(loc -> new LocationDto(loc.getId(), loc.getName(), loc.getCity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(locations);
    }
}