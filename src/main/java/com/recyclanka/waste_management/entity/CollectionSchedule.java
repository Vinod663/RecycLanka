package com.recyclanka.waste_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    @ManyToOne
    @JoinColumn(name="municipal_id", nullable = false)
    private Municipal municipal;

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;

    @Enumerated(EnumType.STRING)
    private Day day;

    private LocalTime time; // Consider using LocalTime for better time representation

    @Enumerated(EnumType.STRING)
    private Status status;


}
