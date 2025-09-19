package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.ComplaintDto;
import com.recyclanka.waste_management.service.ComplaintService;
import com.recyclanka.waste_management.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/complaints")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<APIResponse> createComplaint(@RequestBody ComplaintDto complaintDto) {
        ComplaintDto saved = complaintService.saveComplaint(complaintDto);
        return ResponseEntity.ok(
                new APIResponse(200, "Complaint saved successfully", saved)
        );
    }
}
