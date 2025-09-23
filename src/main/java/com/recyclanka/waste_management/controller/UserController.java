package com.recyclanka.waste_management.controller;

import com.recyclanka.waste_management.dto.ApiResponse;
import com.recyclanka.waste_management.dto.UpdatePasswordDTO;
import com.recyclanka.waste_management.dto.UpdateUserDTO;
import com.recyclanka.waste_management.dto.UserDTO;
import com.recyclanka.waste_management.service.UserService;
import com.recyclanka.waste_management.util.APIResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/users")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    // ✅ Get current user
    @GetMapping("/email/{email}")
    public ResponseEntity<APIResponse> getCurrentUser(@PathVariable String email) {
        UserDTO user = userService.getByEmail(email);
        return ResponseEntity.ok(
                new APIResponse(HttpStatus.OK.value(), "User fetched successfully", user)
        );
    }

    // ===== Update Profile =====
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserDTO dto) {

        UserDTO updated = userService.updateProfile(userDetails.getUsername(), dto);

        return ResponseEntity.ok(
                new ApiResponse(
                        HttpStatus.OK.value(),
                        "Profile updated successfully!",
                        updated
                )
        );
    }

    // ===== Update Password =====
    @PutMapping("/password")
    public ResponseEntity<ApiResponse> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePasswordDTO dto) {

        userService.updatePassword(userDetails.getUsername(), dto);

        return ResponseEntity.ok(
                new ApiResponse(
                        HttpStatus.OK.value(),
                        "Password updated successfully!",
                        null
                )
        );
    }

    // 🔹 Get all users (Admin)
    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse(200, "Users fetched successfully", users));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getUserStats() {
        return ResponseEntity.ok(
                new ApiResponse(200, "User stats fetched successfully", userService.getUserStats())
        );
    }

    // 🔹 Delete user by email
    @DeleteMapping("/{email}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String email) {
        userService.deleteUser(email);
        return ResponseEntity.ok(new ApiResponse(200, "User deleted successfully", null));
    }

}
