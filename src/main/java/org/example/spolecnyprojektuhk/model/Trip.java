package org.example.spolecnyprojektuhk.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.util.Map;

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
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specs", columnDefinition = "jsonb")
    private String specsJson;

    @Column(name = "image_path", length = 255)
    private String imagePath;

    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public Trip() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public TripCategory getCategory() {
        return category;
    }
    public void setCategory(TripCategory category) {
        this.category = category;
    }

    public Location getLocation() {
        return location;
    }
    public void setLocation(Location location) {
        this.location = location;
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

    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSpecsJson() {
        return specsJson;
    }
    public void setSpecsJson(String specsJson) {
        this.specsJson = specsJson;
    }

    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

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

    @Transient
    public void setSpecs(Map<String, Object> specs) {
        try {
            this.specsJson = specs == null ? null : objectMapper.writeValueAsString(specs);
        } catch (JsonProcessingException e) {
            this.specsJson = null;
        }
    }
}
