package org.example.spolecnyprojektuhk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegisterRequest {

    private String username;
    private String email;
    private String password;
    @JsonProperty("isAdmin")
    private boolean isAdmin;

    public RegisterRequest() {}

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}