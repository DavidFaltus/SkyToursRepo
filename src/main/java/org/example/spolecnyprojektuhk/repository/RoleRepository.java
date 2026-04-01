package org.example.spolecnyprojektuhk.repository;

import org.example.spolecnyprojektuhk.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pro přístup k rolím.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Vyhledání role podle jejího názvu.
     * @param name Název role
     * @return Role, pokud existuje
     */
    Optional<Role> findByName(String name);
}