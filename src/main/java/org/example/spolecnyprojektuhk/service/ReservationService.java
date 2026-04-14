package org.example.spolecnyprojektuhk.service;

import org.example.spolecnyprojektuhk.dto.ReservationDetailsDto;
import org.example.spolecnyprojektuhk.dto.ReservationItemDetailsDto;
import org.example.spolecnyprojektuhk.model.*;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.example.spolecnyprojektuhk.repository.ReservationItemRepository;
import org.example.spolecnyprojektuhk.repository.ReservationRepository;
import org.example.spolecnyprojektuhk.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository itemRepository;
    private final AppUserRepository userRepository;
    private final TripRepository tripRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            ReservationItemRepository itemRepository,
            AppUserRepository userRepository,
            TripRepository tripRepository) {
        this.reservationRepository = reservationRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional
    public ReservationDetailsDto getCart(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen."));

        Reservation cart = reservationRepository.findByUserAndStatus(user, "CART")
                .orElseGet(() -> createCart(user));
        
        return mapReservationToDetailsDto(cart);
    }

    @Transactional
    public ReservationDetailsDto addToCart(String username, Long tripId, int quantity) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen."));
        Reservation cart = reservationRepository.findByUserAndStatus(user, "CART")
                .orElseGet(() -> createCart(user));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Let nenalezen."));

        Optional<ReservationItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getTripId().equals(tripId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            ReservationItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
            itemRepository.save(item);
        } else {
            ReservationItem newItem = new ReservationItem();
            newItem.setReservationId(cart.getId());
            newItem.setTripId(tripId);
            newItem.setReservation(cart);
            newItem.setTrip(trip);
            newItem.setQuantity(quantity);
            newItem.setUnitPrice(trip.getPrice());
            cart.getItems().add(newItem);
            itemRepository.save(newItem);
        }
        
        updateCartTotal(cart);
        reservationRepository.save(cart);

        return mapReservationToDetailsDto(cart);
    }

    @Transactional
    public void convertCartToOrder(String username) {
        System.out.println("[Service] Hledám uživatele: " + username);
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel '" + username + "' nenalezen v databázi."));
        
        System.out.println("[Service] Uživatel nalezen, ID: " + user.getId() + ". Hledám košík (status 'CART').");
        
        Reservation cart = reservationRepository.findByUserAndStatus(user, "CART")
                .orElseThrow(() -> new RuntimeException("Pro uživatele '" + username + "' nebyl nalezen žádný košík (status 'CART')."));

        System.out.println("[Service] Košík nalezen, ID: " + cart.getId() + ". Počet položek: " + cart.getItems().size());

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Košík je prázdný.");
        }
        
        System.out.println("[Service] Měním stav košíku na 'PENDING'.");
        cart.setStatus("PENDING");
        reservationRepository.save(cart);
        System.out.println("[Service] Stav košíku úspěšně změněn a uložen.");
    }

    @Transactional(readOnly = true)
    public List<ReservationDetailsDto> getUserReservations(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen."));
        
        return reservationRepository.findByUserAndStatusIsNot(user, "CART").stream()
                .map(this::mapReservationToDetailsDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationDetailsDto> getAllReservations() {
        return reservationRepository.findByStatusIsNot("CART").stream()
                .map(this::mapReservationToDetailsDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateReservationStatus(Long reservationId, String newStatus) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Rezervace s ID " + reservationId + " nenalezena."));
        
        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long reservationId) {
        if (!reservationRepository.existsById(reservationId)) {
            throw new RuntimeException("Rezervace s ID " + reservationId + " nenalezena.");
        }
        reservationRepository.deleteById(reservationId);
    }

    private Reservation createCart(AppUser user) {
        System.out.println("[Service] Vytvářím nový košík pro uživatele: " + user.getUsername());
        Reservation cart = new Reservation();
        cart.setUser(user);
        cart.setStatus("CART");
        cart.setTotalPrice(BigDecimal.ZERO);
        return reservationRepository.save(cart);
    }

    private void updateCartTotal(Reservation cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
    }

    private ReservationDetailsDto mapReservationToDetailsDto(Reservation reservation) {
        ReservationDetailsDto dto = new ReservationDetailsDto();
        dto.setId(reservation.getId());
        dto.setUsername(reservation.getUser().getUsername());
        dto.setUserEmail(reservation.getUser().getEmail()); // Přidáno mapování emailu
        dto.setReservationDate(reservation.getReservationDate());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus());
        dto.setItems(reservation.getItems().stream()
                .map(this::mapReservationItemToDetailsDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private ReservationItemDetailsDto mapReservationItemToDetailsDto(ReservationItem item) {
        ReservationItemDetailsDto dto = new ReservationItemDetailsDto();
        dto.setTripId(item.getTrip().getId());
        dto.setTripName(item.getTrip().getName());
        dto.setTripDescription(item.getTrip().getDescription());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setTripSpecs(item.getTrip().getSpecs());
        return dto;
    }
}