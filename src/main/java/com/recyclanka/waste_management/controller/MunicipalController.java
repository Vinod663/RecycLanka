package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.MunicipalDto;
import com.recyclanka.waste_management.service.impl.MunicipalServiceImpl;
import com.recyclanka.waste_management.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("api/v1/municipal")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MunicipalController {
    private final MunicipalServiceImpl municipalService;


    @GetMapping("getAll")
    public ResponseEntity<APIResponse> getAllMunicipals() {
        List<MunicipalDto> municipalDtos= municipalService.getMunicipals();
        return ResponseEntity.ok(
                new APIResponse(200,
                                "Municipals fetched successfully",
                                municipalDtos)
        );
    }
}
