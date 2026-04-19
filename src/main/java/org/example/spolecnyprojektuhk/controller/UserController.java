package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.ReservationDetailsDto;
import org.example.spolecnyprojektuhk.dto.ReservationSummaryViewDto;
import org.example.spolecnyprojektuhk.dto.UpdateOrderStatusRequest;
import org.example.spolecnyprojektuhk.dto.UserProfileDto;
import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.example.spolecnyprojektuhk.repository.PassengerProfileRepository;
import org.example.spolecnyprojektuhk.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final AppUserRepository appUserRepository;
    private final ReservationService reservationService;
    private final PassengerProfileRepository passengerProfileRepository;

    public UserController(AppUserRepository appUserRepository, ReservationService reservationService, PassengerProfileRepository passengerProfileRepository) {
        this.appUserRepository = appUserRepository;
        this.reservationService = reservationService;
        this.passengerProfileRepository = passengerProfileRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen."));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().getName());
        dto.setCreatedAt(user.getCreatedAt());

        // 2. ZADÁNÍ: VOLÁNÍ DB FUNKCE pro získání infa o pasažérovi z databáze místo složitého skládání v Javě
        String passengerInfo = passengerProfileRepository.getPassengerInfoFromDb(Math.toIntExact(user.getId()));
        dto.setPassengerInfo(passengerInfo);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/me/reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationDetailsDto>> getMyReservations(@AuthenticationPrincipal UserDetails userDetails) {
        List<ReservationDetailsDto> reservations = reservationService.getUserReservations(userDetails.getUsername());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReservationDetailsDto>> getAllReservations() {
        List<ReservationDetailsDto> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    // 1. ZADÁNÍ: VOLÁNÍ POHLEDU PRO SUMMARY REZERVACÍ
    @GetMapping("/reservations/summary")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReservationSummaryViewDto>> getReservationSummary() {
        return ResponseEntity.ok(reservationService.getReservationSummary());
    }

    @PutMapping("/reservations/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> updateReservationStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest request) {
        reservationService.updateReservationStatus(id, request.getNewStatus());
        return ResponseEntity.ok("Stav rezervace úspěšně aktualizován.");
    }

    @DeleteMapping("/reservations/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.ok("Rezervace úspěšně smazána.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
