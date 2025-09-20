package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.ComplaintDto;
import com.recyclanka.waste_management.entity.ComplaintStatus;
import com.recyclanka.waste_management.entity.Priority;
import com.recyclanka.waste_management.service.ComplaintService;
import com.recyclanka.waste_management.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /*@GetMapping
    public ResponseEntity<APIResponse> getAllComplaints() {
        return ResponseEntity.ok(
                new APIResponse(200, "Complaints fetched successfully", complaintService.getAllComplaints())
        );
    }*/

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse> getComplaintById(@PathVariable Long id) {
        ComplaintDto complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(new APIResponse(200, "Complaint fetched successfully", complaint));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> updateComplaint(
            @PathVariable Long id,
            @RequestBody ComplaintDto complaintDto
    ) {
        ComplaintDto updated = complaintService.updateComplaint(id, complaintDto);
        return ResponseEntity.ok(new APIResponse(200, "Complaint updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(new APIResponse(200, "Complaint deleted successfully", null));
    }

    @GetMapping
    public ResponseEntity<APIResponse> getAllComplaints(
            @RequestParam(required = false) String municipalName,
            @RequestParam(required = false) String wardName,
            @RequestParam(required = false) String complaintStatus,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search
    )

    {
        ComplaintStatus statusEnum = complaintStatus != null && !complaintStatus.isEmpty()
                ? ComplaintStatus.valueOf(complaintStatus) : null;

        Priority priorityEnum = priority != null && !priority.isEmpty()
                ? Priority.valueOf(priority) : null;

        List<ComplaintDto> complaints = complaintService.getFilteredComplaints(
                municipalName, wardName, statusEnum, priorityEnum, search
        );

        return ResponseEntity.ok(new APIResponse(200, "Complaints fetched successfully", complaints));
    }

}
