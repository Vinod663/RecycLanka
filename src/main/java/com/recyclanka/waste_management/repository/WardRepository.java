package com.recyclanka.waste_management.repository;

import com.recyclanka.waste_management.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WardRepository extends JpaRepository<Ward,Long> {
    // Native query to find wards by municipal name
    @Query(value = "SELECT w.* " +
            "FROM ward w " +
            "JOIN municipal m ON w.municipal_id = m.municipal_id " +
            "WHERE m.name = :municipalName",
            nativeQuery = true)
    List<Ward> findWardNamesByMunicipalName(@Param("municipalName") String municipalName);

    Optional<Ward> findByName(String name);
}
