package com.sou.eCom.repo;

import com.sou.eCom.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist,Long> {
    Optional<Wishlist> findByUser_UserId(Long userId);

    boolean existsByUser_UserIdAndProducts_Id(Long userId, Long productId);
}
