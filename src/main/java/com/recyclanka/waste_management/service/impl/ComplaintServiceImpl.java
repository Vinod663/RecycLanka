package com.recyclanka.waste_management.service.impl;

import com.recyclanka.waste_management.dto.ComplaintDto;
import com.recyclanka.waste_management.entity.*;
import com.recyclanka.waste_management.repository.ComplaintRepository;
import com.recyclanka.waste_management.repository.MunicipalRepository;
import com.recyclanka.waste_management.repository.WardRepository;
import com.recyclanka.waste_management.service.ComplaintService;
import com.recyclanka.waste_management.specification.ComplaintSpecification;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
        return modelMapper.map(complaint, ComplaintDto.class);
    }

    @Override
    public List<ComplaintDto> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        return complaints.stream()
                .map(complaint -> modelMapper.map(complaint, ComplaintDto.class))
                .toList();
    }

    @Override
    public ComplaintDto updateComplaint(Long id, ComplaintDto complaintDto) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        // update only allowed fields (status, description, etc.)
        if (complaintDto.getComplaintStatus() != null) {
            complaint.setComplaintStatus(complaintDto.getComplaintStatus());
        }
        if (complaintDto.getDescription() != null) {
            complaint.setDescription(complaintDto.getDescription());
        }
        if (complaintDto.getPriority() != null) {
            complaint.setPriority(complaintDto.getPriority());
        }

        Complaint updated = complaintRepository.save(complaint);
        return modelMapper.map(updated, ComplaintDto.class);
    }

    @Override
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Complaint not found with id: " + id);
        }
        complaintRepository.deleteById(id);
    }

    @Override
    public List<ComplaintDto> getFilteredComplaints(String municipalName, String wardName, ComplaintStatus status, Priority priority, String search) {
        /*Specification<Complaint> spec = Specification
                .where(ComplaintSpecification.hasMunicipal(municipalName))
                .and(ComplaintSpecification.hasWard(wardName))
                .and(ComplaintSpecification.hasStatus(status))
                .and(ComplaintSpecification.hasPriority(priority))
                .and(ComplaintSpecification.hasSearch(search));*/

        // Note: you can remove .where() entirely if you prefer:
         Specification<Complaint> spec = ComplaintSpecification.hasMunicipal(municipalName)
                .and(ComplaintSpecification.hasWard(wardName))
                 .and(ComplaintSpecification.hasStatus(status))
                 .and(ComplaintSpecification.hasPriority(priority))
                 .and(ComplaintSpecification.hasSearch(search));

        List<Complaint> complaints = complaintRepository.findAll(spec);

        return complaints.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ComplaintDto mapToDto(Complaint complaint) {
        return ComplaintDto.builder()
                .id(complaint.getId())
                .name(complaint.getName())
                .complaintType(complaint.getComplaintType())
                .priority(complaint.getPriority())
                .complaintStatus(complaint.getComplaintStatus())
                .municipalName(complaint.getMunicipal().getName())
                .wardName(complaint.getWard().getName())
                .description(complaint.getDescription())
                .createdAt(complaint.getCreatedAt())
                .email(complaint.getEmail())
                .phone(complaint.getPhone())
                .build();
    }

}
