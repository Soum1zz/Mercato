package com.sou.eCom.model.dto;

public record RatingResponse(
        double rating,
        long totalRatings
) {
}
