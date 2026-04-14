package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.dto.TripCategoryDto;
import org.example.spolecnyprojektuhk.model.TripCategory;
import org.example.spolecnyprojektuhk.repository.TripCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TripCategoryController {

    private final TripCategoryRepository categoryRepository;

    public TripCategoryController(TripCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<TripCategoryDto>> getAllCategories() {
        List<TripCategoryDto> categories = categoryRepository.findAll().stream()
                .map(cat -> new TripCategoryDto(cat.getId(), cat.getName(), cat.getDescription()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
}