package com.sou.eCom.repo;

import com.sou.eCom.model.SellerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface sellerDetailsRepo extends JpaRepository<SellerDetails, Long> {

    Optional<SellerDetails> findByUser_UserId(long sellerId);

    List<SellerDetails> findByVerificationStatus(SellerDetails.Status status);
}
