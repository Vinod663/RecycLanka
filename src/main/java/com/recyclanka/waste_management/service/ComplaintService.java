package com.recyclanka.waste_management.service;

import com.recyclanka.waste_management.dto.ComplaintDto;
import com.recyclanka.waste_management.entity.ComplaintStatus;
import com.recyclanka.waste_management.entity.Priority;

import java.util.List;

public interface ComplaintService {
    ComplaintDto saveComplaint(ComplaintDto complaintDto);
    ComplaintDto getComplaintById(Long id);
    List<ComplaintDto> getAllComplaints();
    ComplaintDto updateComplaint(Long id, ComplaintDto complaintDto);
    void deleteComplaint(Long id);
    List<ComplaintDto> getFilteredComplaints(String municipalName, String wardName,
                                             ComplaintStatus status, Priority priority,
                                             String search);
}
