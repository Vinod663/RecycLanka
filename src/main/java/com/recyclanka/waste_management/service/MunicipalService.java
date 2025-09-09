package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.MunicipalDto;

import java.util.List;

public interface MunicipalService {
    public boolean isMunicipalExists(String municipalName);
    public List<MunicipalDto> getMunicipals();
}
