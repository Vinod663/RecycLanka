package com.recyclanka.waste_management.repository;

import com.recyclanka.waste_management.entity.CollectionSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionScheduleRepository extends JpaRepository<CollectionSchedule, Long> {
    // Find all schedules by municipal name
    @Query("SELECT cs FROM CollectionSchedule cs " +
            "WHERE cs.municipal.name = :municipalName")
    List<CollectionSchedule> findByMunicipalName(@Param("municipalName") String municipalName);
}
