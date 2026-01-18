package com.sou.eCom.model.dto;

public record AuthResponse(
        String token,
        String role
        ) {
}
