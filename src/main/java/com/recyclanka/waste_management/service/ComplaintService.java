package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.ComplaintDto;

import java.util.List;

public interface ComplaintService {
    ComplaintDto saveComplaint(ComplaintDto complaintDto);
    ComplaintDto getComplaintById(Long id);
    List<ComplaintDto> getAllComplaints();
    ComplaintDto updateComplaint(Long id, ComplaintDto complaintDto);
    void deleteComplaint(Long id);
}
