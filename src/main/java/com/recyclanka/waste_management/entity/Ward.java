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
public class Ward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "municipal_id", nullable = false)
    private Municipal municipal;

    @OneToMany(mappedBy = "ward", cascade = CascadeType.ALL)
    private List<CollectionSchedule> collectionSchedules;


}
