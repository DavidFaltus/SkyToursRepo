package org.example.spolecnyprojektuhk.service;

import org.example.spolecnyprojektuhk.dto.LocationDto;
import org.example.spolecnyprojektuhk.dto.TripCategoryDto;
import org.example.spolecnyprojektuhk.dto.TripDto;
import org.example.spolecnyprojektuhk.model.Location;
import org.example.spolecnyprojektuhk.model.Trip;
import org.example.spolecnyprojektuhk.model.TripCategory;
import org.example.spolecnyprojektuhk.repository.LocationRepository;
import org.example.spolecnyprojektuhk.repository.TripCategoryRepository;
import org.example.spolecnyprojektuhk.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Služba pro práci s lety. Obsahuje business logiku.
 */
@Service
public class TripService {

    private final TripRepository tripRepository;
    private final TripCategoryRepository categoryRepository;
    private final LocationRepository locationRepository;

    public TripService(TripRepository tripRepository, TripCategoryRepository categoryRepository, LocationRepository locationRepository) {
        this.tripRepository = tripRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
    }

    /**
     * Vrátí seznam všech dostupných letů (produktů) s namapovanými kategoriemi a lokacemi.
     * @return Seznam DTO objektů.
     */
    @Transactional(readOnly = true)
    public List<TripDto> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Získá jeden konkrétní let podle jeho ID.
     * @param id ID letu.
     * @return DTO letu.
     * @throws RuntimeException Pokud let neexistuje.
     */
    @Transactional(readOnly = true)
    public TripDto getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Let s ID " + id + " nenalezen."));
        return mapToDto(trip);
    }

    /**
     * Vytvoří nový let.
     * @param tripDto DTO s daty nového letu.
     * @return DTO vytvořeného letu.
     */
    @Transactional
    public TripDto createTrip(TripDto tripDto) {
        Trip trip = new Trip();
        mapDtoToEntity(tripDto, trip);
        Trip savedTrip = tripRepository.save(trip);
        return mapToDto(savedTrip);
    }

    /**
     * Aktualizuje existující let.
     * @param id ID letu, který chceme upravit.
     * @param tripDto Nová data letu.
     * @return Aktualizované DTO.
     */
    @Transactional
    public TripDto updateTrip(Long id, TripDto tripDto) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Let s ID " + id + " nenalezen."));
        
        mapDtoToEntity(tripDto, trip);
        Trip updatedTrip = tripRepository.save(trip);
        return mapToDto(updatedTrip);
    }

    /**
     * Pomocná metoda pro transformaci Entity do DTO, 
     * abychom neodhalovali interní model ven do API.
     */
    private TripDto mapToDto(Trip trip) {
        TripDto dto = new TripDto();
        dto.setId(trip.getId());
        dto.setName(trip.getName());
        dto.setDescription(trip.getDescription());
        dto.setPrice(trip.getPrice());
        dto.setSpecs(trip.getSpecs());
        dto.setImagePath(trip.getImagePath());

        if (trip.getCategory() != null) {
            TripCategory c = trip.getCategory();
            dto.setCategory(new TripCategoryDto(c.getId(), c.getName(), c.getDescription()));
            dto.setCategoryId(c.getId());
        }

        if (trip.getLocation() != null) {
            Location l = trip.getLocation();
            dto.setLocation(new LocationDto(l.getId(), l.getName(), l.getCity()));
            dto.setLocationId(l.getId());
        }

        return dto;
    }

    /**
     * Pomocná metoda pro mapování DTO na entitu.
     */
    private void mapDtoToEntity(TripDto dto, Trip entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setSpecs(dto.getSpecs());
        entity.setImagePath(dto.getImagePath());

        if (dto.getCategoryId() != null) {
            TripCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Kategorie s ID " + dto.getCategoryId() + " nenalezena."));
            entity.setCategory(category);
        }

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Lokace s ID " + dto.getLocationId() + " nenalezena."));
            entity.setLocation(location);
        }
    }
}