package com.sou.eCom.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record ProductRequest(
        String name,
        String description,
        double price,
        String brand,
        String category,
        int stock,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        Date date,
        String imgUrl
) {
}
