package com.recyclanka.waste_management.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse {
    private int status; // HTTP status code
    private String message; // Response message
    private Object data; // Data to be returned in the response, can be any type(Object-->Super Type)
}
