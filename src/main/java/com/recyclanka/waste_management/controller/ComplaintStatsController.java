package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.ComplaintStatsDto;
import com.recyclanka.waste_management.service.ComplaintStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/complaints")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplaintStatsController {

    private final ComplaintStatsService complaintStatsService;

    @GetMapping("/stats")
    public ComplaintStatsDto getStats() {
        return complaintStatsService.getComplaintStats();
    }
}
