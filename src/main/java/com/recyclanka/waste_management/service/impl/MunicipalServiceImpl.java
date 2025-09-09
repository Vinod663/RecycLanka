package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.MunicipalDto;
import com.recyclanka.waste_management.entity.Municipal;
import com.recyclanka.waste_management.repository.MunicipalRepository;
import com.recyclanka.waste_management.service.MunicipalService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class MunicipalServiceImpl implements MunicipalService {
    private final MunicipalRepository municipalRepository;
    private final ModelMapper modelMapper;


    @Override
    public boolean isMunicipalExists(String municipalName) {
        return false;
    }

    @Override
    public List<MunicipalDto> getMunicipals() {
        List<Municipal> allMunicipals = municipalRepository.findAll();
        if (allMunicipals.isEmpty()) {
            throw new RuntimeException("No Municipals found");
        }
        return modelMapper.map(allMunicipals, new TypeToken<List<MunicipalDto>>(){}.getType());
    }
}
