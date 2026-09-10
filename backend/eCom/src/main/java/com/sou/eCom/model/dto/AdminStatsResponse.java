package com.sou.eCom.model.dto;

public record AdminStatsResponse(
        long totalUsers,
        long totalOrders,
        long totalSellers,
        long pendingSellerRequests
) {
}
