package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.AuthDto;
import com.recyclanka.waste_management.dto.AuthResponseDto;
import com.recyclanka.waste_management.dto.RegisterDto;
import com.recyclanka.waste_management.entity.Role;
import com.recyclanka.waste_management.entity.User;
import com.recyclanka.waste_management.repository.UserRepository;
import com.recyclanka.waste_management.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // This annotation indicates that this class is a service component in the Spring context.
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto authenticate(AuthDto authDTO){

        User user = userRepository.findByEmail(authDTO.getEmail()).orElseThrow(()->new RuntimeException("User not found"));

        if (!passwordEncoder.matches(authDTO.getPassword(),user.getPassword())){
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(authDTO.email);
        return new AuthResponseDto(token);
    }


    public String register(RegisterDto registerDto) {
    if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = User.builder()
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .phoneNumber(registerDto.getPhoneNumber())
                .organizationName(registerDto.getOrganizationName())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.valueOf(registerDto.getRole().toUpperCase())) // Assuming Role is an enum
                .build();
        userRepository.save(user);
        return "User registered successfully";

    }
}
