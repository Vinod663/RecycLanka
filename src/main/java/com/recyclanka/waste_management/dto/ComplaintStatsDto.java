package com.recyclanka.waste_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStatsDto {
    private Long pendingCount;
    private Long inProgressCount;
    private Long resolvedCount;
    private Long totalCount;
}
