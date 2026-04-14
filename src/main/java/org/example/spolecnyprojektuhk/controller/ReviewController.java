package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.CreateReviewRequest;
import org.example.spolecnyprojektuhk.dto.ReviewDto;
import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.model.Review;
import org.example.spolecnyprojektuhk.model.Trip;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.example.spolecnyprojektuhk.repository.ReviewRepository;
import org.example.spolecnyprojektuhk.repository.TripRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final AppUserRepository userRepository;
    private final TripRepository tripRepository;

    public ReviewController(ReviewRepository reviewRepository, AppUserRepository userRepository, TripRepository tripRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ReviewDto>> getReviewsForTrip(@PathVariable Long tripId) {
        List<ReviewDto> reviews = reviewRepository.findByTripId(tripId).stream()
                .map(r -> new ReviewDto(
                        r.getId(),
                        r.getUser().getUsername(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<String> addReview(@RequestBody CreateReviewRequest request) {
        // Vytáhne přihlášeného uživatele z kontextu (který nastavil JwtFilter)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new RuntimeException("Let nenalezen"));

        Review review = new Review();
        review.setUser(user);
        review.setTrip(trip);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        return ResponseEntity.ok("Recenze byla úspěšně přidána.");
    }
}