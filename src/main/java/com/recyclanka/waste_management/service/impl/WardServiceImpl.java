package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.WardDto;
import com.recyclanka.waste_management.entity.Ward;
import com.recyclanka.waste_management.repository.WardRepository;
import com.recyclanka.waste_management.service.WardService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WardServiceImpl implements WardService {
    private final WardRepository wardRepository;
    private final ModelMapper modelMapper;
    @Override
    public boolean isWardExists(String wardName) {
        return false;
    }

    @Override
    public boolean isWardExistsInMunicipal(String wardName, Long municipalId) {
        return false;
    }

    @Override
    public Long getWardIdByNameAndMunicipalId(String wardName, Long municipalId) {
        return 0L;
    }

    @Override
    public List<WardDto> getWardsByMunicipalId(Long municipalId) {
        return List.of();
    }

    @Override
    public List<WardDto> getWardsByMunicipalName(String municipalName) {
        List<Ward> wardNames = wardRepository.findWardNamesByMunicipalName(municipalName);

        /*if (wardNames.isEmpty()) {
            throw new RuntimeException("No wards found for municipal: " + municipalName);
        }*/

        return modelMapper.map(wardNames, new TypeToken<List<WardDto>>(){}.getType());

    }
}
