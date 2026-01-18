package com.sou.eCom.service;

import com.sou.eCom.model.SellerDetails;
import com.sou.eCom.repo.sellerDetailsRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {
    @Autowired
    private sellerDetailsRepo sellerDetailsRepo;

    @Transactional
    public void approveSeller(long id) {
        SellerDetails seller = sellerDetailsRepo.findByUser_UserId(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));
        seller.setVerificationStatus(SellerDetails.Status.APPROVED);
        sellerDetailsRepo.save(seller);
    }


}
