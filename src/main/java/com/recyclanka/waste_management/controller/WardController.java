package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.WardDto;
import com.recyclanka.waste_management.service.impl.WardServiceImpl;
import com.recyclanka.waste_management.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/ward")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WardController {
    private final WardServiceImpl wardService;

    //Get Wards by Municipal Name
    @GetMapping("/by-municipal/{municipalName}")
    public ResponseEntity<APIResponse> getWardsByMunicipalName(@PathVariable String municipalName) {
        List<WardDto> wards = wardService.getWardsByMunicipalName(municipalName);
        return ResponseEntity.ok(
                new APIResponse(200, "Wards fetched successfully", wards)
        );
    }
}
