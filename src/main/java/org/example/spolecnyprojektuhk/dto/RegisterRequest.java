package org.example.spolecnyprojektuhk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegisterRequest {

    private String username;
    private String email;
    private String password;
    @JsonProperty("isAdmin")
    private boolean isAdmin; // Nové pole pro určení, zda se jedná o admina

    public RegisterRequest() {
    }

    // ...existing code...

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
     * Vrací e-mail.
     */
    public String getEmail() {
        return email;
    }

    /**
     * setEmail
     * Nastavuje e-mail.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * getPassword
     * Vrací heslo.
     */
    public String getPassword() {
        return password;
    }

    /**
     * setPassword
     * Nastavuje heslo.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * isAdmin
     * Vrací true, pokud se má uživatel registrovat jako administrátor.
     */
    public boolean isAdmin() {
        return isAdmin;
    }

    /**
     * setAdmin
     * Nastavuje, zda se má uživatel registrovat jako administrátor.
     */
    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}