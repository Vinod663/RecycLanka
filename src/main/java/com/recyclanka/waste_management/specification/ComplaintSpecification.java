package com.recyclanka.waste_management.specification;

import com.recyclanka.waste_management.entity.Complaint;
import com.recyclanka.waste_management.entity.ComplaintStatus;
import com.recyclanka.waste_management.entity.Priority;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class ComplaintSpecification {
    public static Specification<Complaint> hasMunicipal(String municipalName) {
        return (root, query, criteriaBuilder) -> {
            if (municipalName == null || municipalName.isEmpty()) return null;
            return criteriaBuilder.equal(root.get("municipal").get("name"), municipalName);
        };
    }

    public static Specification<Complaint> hasWard(String wardName) {
        return (root, query, criteriaBuilder) -> {
            if (wardName == null || wardName.isEmpty()) return null;
            return criteriaBuilder.equal(root.get("ward").get("name"), wardName);
        };
    }

    public static Specification<Complaint> hasStatus(ComplaintStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) return null;
            return criteriaBuilder.equal(root.get("complaintStatus"), status);
        };
    }

    public static Specification<Complaint> hasPriority(Priority priority) {
        return (root, query, criteriaBuilder) -> {
            if (priority == null) return null;
            return criteriaBuilder.equal(root.get("priority"), priority);
        };
    }

    public static Specification<Complaint> hasSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.trim().isEmpty()) {
                return cb.conjunction(); // no filter
            }

            String pattern = "%" + search.toLowerCase() + "%";

            // ✅ Convert description (CLOB) to VARCHAR for LIKE
            Expression<String> descAsString = cb.function("CAST", String.class,
                    root.get("description"),
                    cb.literal("varchar"));

            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern),
                    cb.like(cb.lower(descAsString), pattern)
            );
        };
    }



}
