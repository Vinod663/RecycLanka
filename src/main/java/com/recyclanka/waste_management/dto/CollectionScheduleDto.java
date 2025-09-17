package com.recyclanka.waste_management.dto;

import com.recyclanka.waste_management.entity.Day;
import com.recyclanka.waste_management.entity.Status;
import com.recyclanka.waste_management.entity.WasteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionScheduleDto {
    private Long id;
    private String municipalName;  // comes from frontend
    private String wardName;       // comes from frontend
    private WasteType wasteType;
    private Day day;
    private LocalTime time;
    private Status status;
}
