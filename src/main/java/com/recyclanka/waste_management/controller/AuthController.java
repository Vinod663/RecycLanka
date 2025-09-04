package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.ApiResponse;
import com.recyclanka.waste_management.dto.AuthDto;
import com.recyclanka.waste_management.dto.RegisterDto;
import com.recyclanka.waste_management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDto registerDTO) {
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "User registered successfully",
                        authService.register(registerDTO)
                )
        );
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody AuthDto AuthDTO) {
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "User logged in successfully",
                        authService.authenticate(AuthDTO)
                )
        );
    }
}
