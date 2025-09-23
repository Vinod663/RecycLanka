package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.UpdatePasswordDTO;
import com.recyclanka.waste_management.dto.UpdateUserDTO;
import com.recyclanka.waste_management.dto.UserDTO;
import com.recyclanka.waste_management.entity.User;
import com.recyclanka.waste_management.repository.UserRepository;
import com.recyclanka.waste_management.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserDTO getByEmail(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return modelMapper.map(u, UserDTO.class);
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String email, UpdateUserDTO dto) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (dto.getFirstName() != null) u.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) u.setLastName(dto.getLastName());
        if (dto.getPhoneNumber() != null) u.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getOrganizationName() != null) u.setOrganizationName(dto.getOrganizationName());
        User saved = userRepository.save(u);
        return modelMapper.map(saved, UserDTO.class);
    }

    @Override
    @Transactional
    public void updatePassword(String email, UpdatePasswordDTO dto) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        // verify current password
        if (!passwordEncoder.matches(dto.getCurrentPassword(), u.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        u.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(u);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Long> getUserStats() {
        Map<String, Long> stats = new HashMap<>();

        // total users
        stats.put("total", userRepository.count());

        // predefined categories
        stats.put("municipal", userRepository.countByOrganizationName("Municipal Council"));
        stats.put("citizen", userRepository.countByOrganizationName("Citizen"));
        stats.put("organization",
                userRepository.countByOrganizationName("Waste Collection Services") +
                        userRepository.countByOrganizationName("Recycling Center") +
                        userRepository.countByOrganizationName("Environmental Agency") +
                        userRepository.countByOrganizationName("Other")
        );

        return stats;
    }

    @Override
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        userRepository.delete(user);
    }


}
