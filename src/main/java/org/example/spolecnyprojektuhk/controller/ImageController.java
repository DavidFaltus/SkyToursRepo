package org.example.spolecnyprojektuhk.controller;

import org.example.spolecnyprojektuhk.model.Trip;
import org.example.spolecnyprojektuhk.repository.TripRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ImageController {

    private final TripRepository tripRepository;
    
    // Cesta do složky foto ve rootu projektu
    private final String UPLOAD_DIR = "foto/";

    public ImageController(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
        // Vytvoří složku pokud neexistuje při startu (pouze pro dev/prod s file systémem)
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            // V prod profilu (H2) může selhat - ignorujeme
            System.err.println("Varování: Nelze vytvořit složku pro obrázky: " + e.getMessage());
        }
    }

    @PostMapping("/upload/{tripId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> uploadImage(@PathVariable Long tripId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nebyl vybrán žádný soubor.");
        }

        try {
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() -> new RuntimeException("Let nenalezen"));

            // Vygenerování unikátního názvu souboru, abychom zamezili přepsání
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);

            // Uložení na disk
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Uložení cesty (názvu) do DB k letu
            trip.setImagePath(uniqueFileName);
            tripRepository.save(trip);

            return ResponseEntity.ok("{\"filename\": \"" + uniqueFileName + "\"}");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Chyba při ukládání souboru.");
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = Paths.get(UPLOAD_DIR).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Pokusíme se uhodnout mime type pro správné zobrazení v prohlížeči
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
