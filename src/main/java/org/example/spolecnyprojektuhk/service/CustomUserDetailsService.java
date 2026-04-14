package org.example.spolecnyprojektuhk.service;

import org.example.spolecnyprojektuhk.model.AppUser;
import org.example.spolecnyprojektuhk.repository.AppUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    public CustomUserDetailsService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Uživatel nebyl nalezen: " + username));

        // Nastaví Spring Security roli na základě role z DB
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(appUser.getRole().getName());

        return new User(
                appUser.getUsername(),
                appUser.getPassword(),
                Collections.singleton(authority)
        );
    }
}