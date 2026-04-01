package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.config.JwtService;
import org.example.spolecnyprojektuhk.dto.AuthRequest;
import org.example.spolecnyprojektuhk.dto.AuthResponse;
import org.example.spolecnyprojektuhk.dto.RegisterRequest;
import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.example.spolecnyprojektuhk.service.AuthService;
import org.example.spolecnyprojektuhk.service.CustomUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller obsluhující přihlašování, registraci a vydávání JWT tokenů.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AppUserRepository userRepository;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager,
                          CustomUserDetailsService userDetailsService,
                          JwtService jwtService,
                          AppUserRepository userRepository,
                          AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    /**
     * login
     * Přihlásí uživatele a vrátí JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtService.generateToken(userDetails);
        AppUser appUser = userRepository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(jwt, appUser.getUsername(), appUser.getRole().getName()));
    }

    /**
     * register
     * Zaregistruje nového uživatele a vrátí JWT token pro automatické přihlášení.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        authService.registerUser(request);
        
        // Automaticky přihlásit nového uživatele
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtService.generateToken(userDetails);
        AppUser appUser = userRepository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(jwt, appUser.getUsername(), appUser.getRole().getName()));
    }
}