package org.example.spolecnyprojektuhk.dto;

import java.time.LocalDateTime;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public UserProfileDto() {}

    /**
     * getId
     * Vrací ID uživatele.
     */
    public Long getId() {
        return id;
    }

    /**
     * setId
     * Nastavuje ID uživatele.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getUsername
     * Vrací uživatelské jméno.
     */
    public String getUsername() {
        return username;
    }

    /**
     * setUsername
     * Nastavuje uživatelské jméno.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * getEmail
     * Vrací e-mail uživatele.
     */
    public String getEmail() {
        return email;
    }

    /**
     * setEmail
     * Nastavuje e-mail uživatele.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * getRole
     * Vrací roli uživatele.
     */
    public String getRole() {
        return role;
    }

    /**
     * setRole
     * Nastavuje roli uživatele.
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * getCreatedAt
     * Vrací datum a čas vytvoření účtu.
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * setCreatedAt
     * Nastavuje datum a čas vytvoření účtu.
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
