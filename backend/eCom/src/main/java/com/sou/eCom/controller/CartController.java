package com.sou.eCom.controller;

import com.sou.eCom.model.Cart;
import com.sou.eCom.model.dto.CartDto.CartResponse;
import com.sou.eCom.model.dto.CartDto.UpdateToCartRequest;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.repo.CartRepo;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("https://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private CartRepo cartRepo;

    @PutMapping("/me/cart")
    public ResponseEntity<CartResponse> updateCart(@AuthenticationPrincipal UserPrincipal principal, @RequestBody UpdateToCartRequest req) {
        return new ResponseEntity<> (cartService.updateCart(principal.getUser().getUserId(), req), HttpStatus.OK);
    }
    @PostMapping("/me/cart/order")
    public ResponseEntity<OrderResponse> placeOrderFromCart(@AuthenticationPrincipal UserPrincipal principal){
        return new ResponseEntity<>(cartService.postOrder(principal.getUser().getUserId()),HttpStatus.OK);
    }
    @DeleteMapping("/me/cart")
    public ResponseEntity<?> deleteCart(@AuthenticationPrincipal  UserPrincipal principal) {
        cartService.deleteCart(principal.getUser().getUserId());
        return new ResponseEntity<>("Cart Deleted" ,HttpStatus.OK);
    }

    @DeleteMapping("/me/cart/items/{productId}")
    public ResponseEntity<?> deleteCartItem(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long productId) {
        cartService.deleteCartItem(principal.getUser().getUserId(),productId);
        return new ResponseEntity<>("Cart Item Deleted" ,HttpStatus.OK);
    }
}
