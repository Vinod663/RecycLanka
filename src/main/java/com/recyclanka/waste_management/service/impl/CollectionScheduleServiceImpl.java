package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.CollectionScheduleDto;
import com.recyclanka.waste_management.entity.CollectionSchedule;
import com.recyclanka.waste_management.entity.Municipal;
import com.recyclanka.waste_management.entity.Ward;
import com.recyclanka.waste_management.repository.CollectionScheduleRepository;
import com.recyclanka.waste_management.repository.MunicipalRepository;
import com.recyclanka.waste_management.repository.WardRepository;
import com.recyclanka.waste_management.service.CollectionScheduleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionScheduleServiceImpl implements CollectionScheduleService {
    private final CollectionScheduleRepository scheduleRepository;
    private final MunicipalRepository municipalRepository;
    private final WardRepository wardRepository;
    private final ModelMapper modelMapper;

    @Override
    public CollectionScheduleDto saveSchedule(CollectionScheduleDto scheduleDto) {
        // find municipal by name
        Municipal municipal = municipalRepository.findByName(scheduleDto.getMunicipalName())
                .orElseThrow(() -> new RuntimeException("Municipal not found: " + scheduleDto.getMunicipalName()));

        // find ward by name
        Ward ward = wardRepository.findByName(scheduleDto.getWardName())
                .orElseThrow(() -> new RuntimeException("Ward not found: " + scheduleDto.getWardName()));

        // map dto -> entity
        CollectionSchedule schedule = modelMapper.map(scheduleDto, CollectionSchedule.class);
        schedule.setMunicipal(municipal);
        schedule.setWard(ward);

        // save
        CollectionSchedule saved = scheduleRepository.save(schedule);

        // map entity -> dto
        CollectionScheduleDto response = modelMapper.map(saved, CollectionScheduleDto.class);
        response.setMunicipalName(municipal.getName());
        response.setWardName(ward.getName());

        return response;
    }

    @Override
    public List<CollectionScheduleDto> getSchedulesByMunicipal(String municipalName) {
        List<CollectionSchedule> schedules = scheduleRepository.findByMunicipalName(municipalName);

        return schedules.stream().map(schedule -> {
            CollectionScheduleDto dto = modelMapper.map(schedule, CollectionScheduleDto.class);
            dto.setMunicipalName(schedule.getMunicipal().getName());
            dto.setWardName(schedule.getWard().getName());
            return dto;
        }).toList();
    }

    @Override
    public CollectionScheduleDto updateSchedule(Long id, CollectionScheduleDto dto) {
        CollectionSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id " + id));

        // update only fields coming from payload
        existing.setWasteType(dto.getWasteType());
        existing.setDay(dto.getDay());
        existing.setTime(dto.getTime());
        existing.setStatus(dto.getStatus());

        CollectionSchedule updated = scheduleRepository.save(existing);
        return modelMapper.map(updated, CollectionScheduleDto.class);
    }

    @Override
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new RuntimeException("Schedule not found with id " + id);
        }
        scheduleRepository.deleteById(id);
    }
}
