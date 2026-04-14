package org.example.spolecnyprojektuhk.dto;

import java.math.BigDecimal;
import java.util.Map;

public class TripDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Map<String, Object> specs;
    private String imagePath;
    private TripCategoryDto category;
    private LocationDto location;
    private Long categoryId; // ID pro aktualizaci
    private Long locationId; // ID pro aktualizaci

    public TripDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Map<String, Object> getSpecs() { return specs; }
    public void setSpecs(Map<String, Object> specs) { this.specs = specs; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public TripCategoryDto getCategory() { return category; }
    public void setCategory(TripCategoryDto category) { this.category = category; }

    public LocationDto getLocation() { return location; }
    public void setLocation(LocationDto location) { this.location = location; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
}