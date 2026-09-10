package com.sou.eCom.service;

import com.sou.eCom.model.SellerDetails;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.AdminStatsResponse;
import com.sou.eCom.repo.OrderRepo;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.repo.sellerDetailsRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {
    @Autowired
    private sellerDetailsRepo sellerDetailsRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OrderRepo orderRepo;

    @Transactional
    public void approveSeller(long id) {
        SellerDetails seller = sellerDetailsRepo.findByUser_UserId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        seller.setVerificationStatus(SellerDetails.Status.APPROVED);
        sellerDetailsRepo.save(seller);
    }

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepo.count();
        long totalOrders = orderRepo.count();
        long totalSellers = userRepo.countByRole(User.UserRole.SELLER);
        long pendingRequests = sellerDetailsRepo.findByVerificationStatus(SellerDetails.Status.PENDING).size();

        return new AdminStatsResponse(totalUsers, totalOrders, totalSellers, pendingRequests);
    }
}
