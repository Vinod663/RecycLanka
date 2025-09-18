package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.CollectionScheduleDto;
import com.recyclanka.waste_management.service.CollectionScheduleService;
import com.recyclanka.waste_management.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/schedules")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CollectionScheduleController {
    private final CollectionScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<APIResponse> saveSchedule(@RequestBody CollectionScheduleDto scheduleDto) {
        CollectionScheduleDto saved = scheduleService.saveSchedule(scheduleDto);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Schedule saved successfully",
                        saved)
        );
    }

    @GetMapping("/by-municipal/{municipalName}")
    public ResponseEntity<APIResponse> getSchedulesByMunicipal(@PathVariable String municipalName) {
        List<CollectionScheduleDto> schedules = scheduleService.getSchedulesByMunicipal(municipalName);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Schedules retrieved successfully",
                        schedules)
        );
    }

    // 🔹 Update Schedule
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> updateSchedule(@PathVariable Long id, @RequestBody CollectionScheduleDto scheduleDto) {
        CollectionScheduleDto updated = scheduleService.updateSchedule(id, scheduleDto);
        return ResponseEntity.ok(new APIResponse(200, "Schedule updated successfully", updated));
    }

    // 🔹 Delete Schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(new APIResponse(200, "Schedule deleted successfully", null));
    }

    @GetMapping
    public ResponseEntity<APIResponse> getAllSchedules() {
        List<CollectionScheduleDto> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "All schedules retrieved successfully",
                        schedules)
        );
    }

}
