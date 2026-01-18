package com.sou.eCom.model.dto.CartDto;

public record   UpdateToCartRequest(
        Long productId,
        int quantity
) {
}
