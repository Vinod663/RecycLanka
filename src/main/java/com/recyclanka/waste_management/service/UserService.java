package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.UpdatePasswordDTO;
import com.recyclanka.waste_management.dto.UpdateUserDTO;
import com.recyclanka.waste_management.dto.UserDTO;

import java.util.List;
import java.util.Map;

public interface UserService {
    UserDTO getByEmail(String email);
    UserDTO updateProfile(String email, UpdateUserDTO dto);
    void updatePassword(String email, UpdatePasswordDTO dto);
    List<UserDTO> getAllUsers();
    Map<String, Long> getUserStats();
    void deleteUser(String email);

}
