package com.recyclanka.waste_management.dto;


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
