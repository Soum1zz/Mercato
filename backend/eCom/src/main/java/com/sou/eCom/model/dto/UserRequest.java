package com.sou.eCom.model.dto;

public record UserRequest(
         String name,
         String password,
         String email,
         String phoneNumber,
         String address,
         int pinCode,
         String role

) {
}
