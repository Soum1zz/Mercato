package com.sou.eCom.model.dto;


import java.util.List;

public record OrderRequest(

        List<OrderItemRequest> items
) {
}
