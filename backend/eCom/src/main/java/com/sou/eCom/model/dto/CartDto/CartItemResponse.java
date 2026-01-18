package com.sou.eCom.model.dto.CartDto;

public record CartItemResponse(
        Long productId,
        String productName,
        double price,
        int quantity,
        double totalPrice
) {
}
