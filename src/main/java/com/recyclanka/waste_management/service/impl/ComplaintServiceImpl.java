package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.ComplaintDto;
import com.recyclanka.waste_management.entity.Complaint;
import com.recyclanka.waste_management.entity.Municipal;
import com.recyclanka.waste_management.entity.Ward;
import com.recyclanka.waste_management.repository.ComplaintRepository;
import com.recyclanka.waste_management.repository.MunicipalRepository;
import com.recyclanka.waste_management.repository.WardRepository;
import com.recyclanka.waste_management.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final MunicipalRepository municipalRepository;
    private final WardRepository wardRepository;
    private final  ModelMapper modelMapper;


    @Override
    public ComplaintDto saveComplaint(ComplaintDto complaintDto) {
        // Fetch Municipal by name
        Municipal municipal = municipalRepository.findByName(complaintDto.getMunicipalName())
                .orElseThrow(() -> new RuntimeException("Municipal not found"));

        // Fetch Ward by name AND municipal to avoid ambiguity
        Ward ward = wardRepository.findByName(complaintDto.getWardName())
                .orElseThrow(() -> new RuntimeException("Ward not found: " + complaintDto.getWardName()));

        // Map DTO to entity
        Complaint complaint = modelMapper.map(complaintDto, Complaint.class);
        complaint.setMunicipal(municipal);
        complaint.setWard(ward);

        // Save and return DTO
        Complaint saved = complaintRepository.save(complaint);
        return modelMapper.map(saved, ComplaintDto.class);
    }

    @Override
    public ComplaintDto getComplaintById(Long id) {
        return null;
    }

    @Override
    public List<ComplaintDto> getAllComplaints() {
        return List.of();
    }

    @Override
    public ComplaintDto updateComplaint(Long id, ComplaintDto complaintDto) {
        return null;
    }

    @Override
    public void deleteComplaint(Long id) {

    }
}
