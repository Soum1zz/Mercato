package com.sou.eCom.model.dto;

public record OrderItemRequest(
        long productId,
        int productQuantity
) {
}
