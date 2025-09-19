package com.recyclanka.waste_management.dto;

import com.recyclanka.waste_management.entity.ComplaintStatus;
import com.recyclanka.waste_management.entity.ComplaintType;
import com.recyclanka.waste_management.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDto {
    private Long id;
    private String municipalName;
    private String wardName;
    private ComplaintStatus complaintStatus;
    private ComplaintType complaintType;
    private Priority priority;
    private String description;
    private String name;
    private String email;
    private String phone;
}
