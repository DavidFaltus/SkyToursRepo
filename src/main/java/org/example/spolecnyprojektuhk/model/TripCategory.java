package org.example.spolecnyprojektuhk.model;

import jakarta.persistence.*;

/**
 * Entita reprezentující kategorii zážitkových letů (např. Vyhlídkové, Adrenalinové).
 * Tabulka 'trip_category'.
 */
@Entity
@Table(name = "trip_category")
public class TripCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    public TripCategory() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}