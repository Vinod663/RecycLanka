package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.WardDto;

import java.util.List;

public interface WardService {
    public boolean isWardExists(String wardName);
    public boolean isWardExistsInMunicipal(String wardName, Long municipalId);
    public Long getWardIdByNameAndMunicipalId(String wardName, Long municipalId);
    public List<WardDto> getWardsByMunicipalId(Long municipalId);
    public List<WardDto> getWardsByMunicipalName(String municipalName);
}
