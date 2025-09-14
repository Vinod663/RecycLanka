package com.recyclanka.waste_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Municipal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "municipal_id")
    private long id;

    private String name;

    @OneToMany(mappedBy = "municipal", cascade = CascadeType.ALL)
    private List<CollectionSchedule> collectionSchedules;

}
