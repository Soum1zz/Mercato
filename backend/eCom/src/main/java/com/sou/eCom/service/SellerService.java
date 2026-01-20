package com.sou.eCom.service;

import com.sou.eCom.model.SellerDetails;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.SellerDetailReq;
import com.sou.eCom.model.dto.SellerDetailRes;
import com.sou.eCom.model.dto.UserResponse;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.repo.sellerDetailsRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SellerService {
    @Autowired
    sellerDetailsRepo sellerDetailsRepo;
    @Autowired
    UserRepo userRepo;
    @Transactional
    public void setSellerDetails(long sellerId, SellerDetailReq req) throws IOException {
        User user = userRepo.findById(sellerId).orElseThrow(()->new RuntimeException("User not found"));
        SellerDetails seller = sellerDetailsRepo.findByUser_UserId(sellerId)
                .orElseGet(()->{
                    SellerDetails sellerDetails = new SellerDetails();
                    sellerDetails.setUser(user);
                    sellerDetails.setVerificationStatus(SellerDetails.Status.PENDING);
                    return sellerDetails;
                });


        seller.setBusinessDescription(req.description());
        seller.setTaxId(req.taxId());
        seller.setUser(user);
        if(req.imgUrl()!=null&&!req.imgUrl().isEmpty())
        {
            seller.setCertificateImageUrl(req.imgUrl());
        }
        sellerDetailsRepo.save(seller);
    }

    public SellerDetailRes getSellerDetails(long sellerId) {
        SellerDetails seller= sellerDetailsRepo.findByUser_UserId(sellerId).orElseThrow(()->new RuntimeException("User not found"));
        SellerDetailRes res= new SellerDetailRes(
                seller.getTaxId(),
                seller.getBusinessDescription(),
                seller.getVerificationStatus().toString()
        );

    return res;
    }

    public List<UserResponse> getPendingSellers() {
        List<UserResponse> sellers=new ArrayList<>();
        List<SellerDetails> sellersDetails=sellerDetailsRepo.findByVerificationStatus(SellerDetails.Status.PENDING);
        for(SellerDetails sellerDetails:sellersDetails){
            User user= userRepo.findById(sellerDetails.getUser().getUserId()).orElseThrow(()->new RuntimeException("User not found"));
            sellers.add(
                    new UserResponse(user.getUserId(),
                    user.getUserName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getAddress(),
                    user.getPinCode(),
                    String.valueOf(user.getRole()))
            );
        }
        return sellers;
    }

    public String getCertificateImage(Long userId) {
        SellerDetails seller= sellerDetailsRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("User not found"));
        return seller.getCertificateImageUrl();
    }
}
