package com.sou.eCom.model.dto;

public record UserResponse(
        long userId,
        String name,
        String email,
        String phoneNumber,
        String address,
        int pinCode,
        String role

) {
}
