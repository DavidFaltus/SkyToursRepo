package org.example.spolecnyprojektuhk.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.spolecnyprojektuhk.service.CustomUserDetailsService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String requestPath = request.getRequestURI();
        
        // Získáme header "Authorization"
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        System.out.println("\n--- [JWT Filter] ---");
        System.out.println("Request: " + request.getMethod() + " " + requestPath);
        System.out.println("Authorization header: " + (authHeader != null && authHeader.startsWith("Bearer ") ? "Přítomno" : "CHYBÍ nebo nezačíná na 'Bearer '"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = authHeader.substring(7);
            username = jwtService.extractUsername(jwt);
            System.out.println("Ověřování tokenu pro uživatele: '" + username + "'");

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("Načten UserDetails pro: '" + userDetails.getUsername() + "' s rolemi: " + userDetails.getAuthorities());

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    System.out.println("Token je platný.");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication nastavena v SecurityContextHolder.");
                } else {
                    System.err.println("Token NENÍ platný!");
                }
            } else {
                System.out.println("Username je null nebo uživatel je již autentizován v tomto requestu.");
            }
        } catch (Exception e) {
            System.err.println("Chyba při ověřování tokenu: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
        System.out.println("--- [JWT Filter] Konec ---\n");
    }
}