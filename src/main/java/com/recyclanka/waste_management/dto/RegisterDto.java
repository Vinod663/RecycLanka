package com.recyclanka.waste_management.dto;

import com.recyclanka.waste_management.entity.Role;
import lombok.Data;

@Data
public class RegisterDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String organizationName;
    private String role;
}
