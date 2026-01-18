package com.sou.eCom.model.dto;

import com.sou.eCom.model.Order;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        long id,
        Order.OrderStatus status,
        LocalDate date,
        double totalPrice,
        List<OrderItemResponse> orderItemResponseList
) {
}
