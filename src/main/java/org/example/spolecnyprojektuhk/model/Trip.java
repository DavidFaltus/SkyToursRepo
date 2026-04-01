package org.example.spolecnyprojektuhk.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Entita reprezentující konkrétní let (produkt k zakoupení).
 * Tabulka 'trip'.
 */
@Entity
@Table(name = "trip")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vazba ManyToOne na kategorii
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private TripCategory category;

    // Vazba ManyToOne na lokaci
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // JSON pole převedené na Map<String, Object> pro specifické údaje (JSONB v databázi)
    @Column(name = "specs", columnDefinition = "jsonb")
    private String specsJson;

    @Column(name = "image_path", length = 255)
    private String imagePath;

    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public Trip() {}

    /**
     * getId
     * Vrací ID letu.
     */
    public Long getId() {
        return id;
    }

    /**
     * setId
     * Nastavuje ID letu.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * getCategory
     * Vrací kategorii letu.
     */
    public TripCategory getCategory() {
        return category;
    }

    /**
     * setCategory
     * Nastavuje kategorii letu.
     */
    public void setCategory(TripCategory category) {
        this.category = category;
    }

    /**
     * getLocation
     * Vrací lokaci letu.
     */
    public Location getLocation() {
        return location;
    }

    /**
     * setLocation
     * Nastavuje lokaci letu.
     */
    public void setLocation(Location location) {
        this.location = location;
    }

    /**
     * getName
     * Vrací název letu.
     */
    public String getName() {
        return name;
    }

    /**
     * setName
     * Nastavuje název letu.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * getDescription
     * Vrací popis letu.
     */
    public String getDescription() {
        return description;
    }

    /**
     * setDescription
     * Nastavuje popis letu.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * getPrice
     * Vrací cenu letu.
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * setPrice
     * Nastavuje cenu letu.
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * getSpecsJson
     * Vrací JSON řetězec se specifikacemi letu.
     */
    public String getSpecsJson() {
        return specsJson;
    }

    /**
     * setSpecsJson
     * Nastavuje JSON řetězec se specifikacemi letu.
     */
    public void setSpecsJson(String specsJson) {
        this.specsJson = specsJson;
    }

    /**
     * getImagePath
     * Vrací cestu k obrázku letu.
     */
    public String getImagePath() {
        return imagePath;
    }

    /**
     * setImagePath
     * Nastavuje cestu k obrázku letu.
     */
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    /**
     * getSpecs
     * Vrací specifikace letu jako Mapu objektů.
     */
    @Transient
    public Map<String, Object> getSpecs() {
        if (specsJson == null || specsJson.trim().isEmpty()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(specsJson, Map.class);
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }

    /**
     * setSpecs
     * Nastavuje specifikace letu z Mapy objektů.
     */
    @Transient
    public void setSpecs(Map<String, Object> specs) {
        try {
            this.specsJson = specs == null ? null : objectMapper.writeValueAsString(specs);
        } catch (JsonProcessingException e) {
            this.specsJson = null;
        }
    }
}