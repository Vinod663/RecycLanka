package com.recyclanka.waste_management;

import com.recyclanka.waste_management.dto.WardDto;
import com.recyclanka.waste_management.entity.Ward;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RecycLankaApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecycLankaApplication.class, args);
    }


    /*@Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }*/

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // Custom mapping: Ward.municipal.id -> WardDto.municipalId
        mapper.typeMap(Ward.class, WardDto.class).addMappings(m -> {
            m.map(src -> src.getMunicipal().getId(), WardDto::setMunicipalId);
        });

        return mapper;
    }
}
