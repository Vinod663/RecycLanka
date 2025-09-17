package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.CollectionScheduleDto;

import java.util.List;

public interface CollectionScheduleService {
    CollectionScheduleDto saveSchedule(CollectionScheduleDto scheduleDto);
    List<CollectionScheduleDto> getSchedulesByMunicipal(String municipalName);
    CollectionScheduleDto updateSchedule(Long id, CollectionScheduleDto dto);
    void deleteSchedule(Long id);
}
