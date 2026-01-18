package com.sou.eCom.repo;

import com.fasterxml.jackson.annotation.OptBoolean;
import com.sou.eCom.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem,Long> {
    Optional<CartItem> findByCartCartIdAndProductId(Long cartId, Long productId);
}
