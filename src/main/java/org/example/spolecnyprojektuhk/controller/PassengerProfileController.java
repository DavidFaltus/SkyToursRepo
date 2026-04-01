package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.model.PassengerProfile;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.example.spolecnyprojektuhk.repository.PassengerProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Controller pro správu profilu pasažéra (výška, váha, medical notes atd.).
 */
@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*", maxAge = 3600) // Vráceno pro konkrétní kontrolery
public class PassengerProfileController {

    private final PassengerProfileRepository profileRepository;
    private final AppUserRepository userRepository;

    public PassengerProfileController(PassengerProfileRepository profileRepository, AppUserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    /**
     * Vrátí profil aktuálně přihlášeného uživatele.
     * Metoda: GET /api/profiles/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        Optional<PassengerProfile> profile = profileRepository.findByUserId(user.getId());
        
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Aktualizace nebo vytvoření profilu aktuálně přihlášeného uživatele.
     * Metoda: POST /api/profiles/me
     */
    @PostMapping("/me")
    public ResponseEntity<String> updateMyProfile(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        AppUser user = userRepository.findByUsername(username).orElseThrow();

        // Zkontroluje zda profil už existuje
        PassengerProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(new PassengerProfile());

        profile.setUser(user);
        
        if (payload.containsKey("weightKg")) {
            profile.setWeightKg(new BigDecimal(payload.get("weightKg").toString()));
        }
        if (payload.containsKey("heightCm")) {
            profile.setHeightCm(new BigDecimal(payload.get("heightCm").toString()));
        }
        if (payload.containsKey("medicalNotes")) {
            profile.setMedicalNotes(payload.get("medicalNotes").toString());
        }

        profileRepository.save(profile);
        return ResponseEntity.ok("Profil byl aktualizován.");
    }
}