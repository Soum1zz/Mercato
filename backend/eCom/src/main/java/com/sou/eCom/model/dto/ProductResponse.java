package com.sou.eCom.model.dto;

public record ProductResponse(
        Long id,
        String name,
        String description,
        double price,
        String brand,
        String category,
        int stock,
        String status,
        long sellerId
) {
}
