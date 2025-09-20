package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.ComplaintStatsDto;
import com.recyclanka.waste_management.entity.ComplaintStatus;
import com.recyclanka.waste_management.repository.ComplaintRepository;
import com.recyclanka.waste_management.service.ComplaintStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ComplaintStatsServiceImpl implements ComplaintStatsService {

    private final ComplaintRepository complaintRepository;

    @Override
    public ComplaintStatsDto getComplaintStats() {
        Long pending = complaintRepository.countByComplaintStatus(ComplaintStatus.PENDING);
        Long inProgress = complaintRepository.countByComplaintStatus(ComplaintStatus.IN_PROGRESS);
        Long resolved = complaintRepository.countByComplaintStatus(ComplaintStatus.RESOLVED);
        Long total = complaintRepository.count();

        return ComplaintStatsDto.builder()
                .pendingCount(pending)
                .inProgressCount(inProgress)
                .resolvedCount(resolved)
                .totalCount(total)
                .build();
    }
}
