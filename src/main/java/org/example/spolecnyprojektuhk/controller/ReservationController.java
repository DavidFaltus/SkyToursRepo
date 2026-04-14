package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.CartItemRequest;
import org.example.spolecnyprojektuhk.dto.ReservationDetailsDto;
import org.example.spolecnyprojektuhk.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDetailsDto> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ReservationDetailsDto cart = reservationService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDetailsDto> addToCart(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CartItemRequest itemRequest) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ReservationDetailsDto cart = reservationService.addToCart(userDetails.getUsername(), itemRequest.getTripId(), itemRequest.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> convertCartToOrder(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("\n--- [Controller] /api/cart/checkout ---");
        if (userDetails == null) {
            // Tato situace by neměla nastat díky @PreAuthorize, ale pro jistotu
            System.err.println("Chyba: UserDetails je NULL, ačkoliv je vyžadována autentizace.");
            return ResponseEntity.status(401).body("Uživatel není autentizován.");
        }
        
        String username = userDetails.getUsername();
        System.out.println("Požadavek na konverzi košíku pro uživatele: '" + username + "'");
        
        try {
            reservationService.convertCartToOrder(username);
            System.out.println("Úspěch: Košík pro '" + username + "' byl převeden na objednávku.");
            return ResponseEntity.ok("Objednávka byla úspěšně vytvořena.");
        } catch (RuntimeException e) {
            System.err.println("Chyba při konverzi košíku: " + e.getMessage());
            // Vracíme 404 Not Found, pokud košík neexistuje, nebo 400 Bad Request pro jiné chyby
            if (e.getMessage().contains("nenalezen")) {
                return ResponseEntity.status(404).body(e.getMessage());
            }
            return ResponseEntity.status(400).body(e.getMessage());
        } finally {
            System.out.println("--- [Controller] Konec /api/cart/checkout ---\n");
        }
    }
}