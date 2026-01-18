package com.sou.eCom.model.dto;

public record OrderItemResponse(
        String productName,
        int productQuantity,
        double price
) {
}
