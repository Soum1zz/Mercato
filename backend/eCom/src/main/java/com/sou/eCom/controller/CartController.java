package com.sou.eCom.controller;

import com.sou.eCom.model.dto.CartDto.CartResponse;
import com.sou.eCom.model.dto.CartDto.UpdateToCartRequest;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.model.dto.PaymentVerificationRequest;
import com.sou.eCom.repo.CartRepo;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.CartService;
import com.sou.eCom.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private PaymentService paymentService;

    @PutMapping("/me/cart")
    public ResponseEntity<CartResponse> updateCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UpdateToCartRequest req) {
        return new ResponseEntity<>(cartService.updateCart(principal.getUser().getUserId(), req), HttpStatus.OK);
    }

    /**
     * Combined checkout endpoint: verifies Razorpay signature, places the order,
     * and records a Payment row — all atomically in one call.
     * The frontend calls this after the user completes payment in the Razorpay modal.
     */
    @PostMapping("/me/cart/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody PaymentVerificationRequest req) {

        boolean valid = paymentService.verifySignature(
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
        );
        if (!valid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        OrderResponse orderResponse = cartService.postOrderWithPayment(
                principal.getUser().getUserId(),
                req.getAmount(),
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId()
        );
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    /** Kept for non-payment order flows. Paid orders should use /me/cart/checkout. */
    @PostMapping("/me/cart/order")
    public ResponseEntity<OrderResponse> placeOrderFromCart(
            @AuthenticationPrincipal UserPrincipal principal) {
        return new ResponseEntity<>(cartService.postOrder(principal.getUser().getUserId()), HttpStatus.OK);
    }

    @DeleteMapping("/me/cart")
    public ResponseEntity<?> deleteCart(@AuthenticationPrincipal UserPrincipal principal) {
        cartService.deleteCart(principal.getUser().getUserId());
        return new ResponseEntity<>("Cart Deleted", HttpStatus.OK);
    }

    @DeleteMapping("/me/cart/items/{productId}")
    public ResponseEntity<?> deleteCartItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        cartService.deleteCartItem(principal.getUser().getUserId(), productId);
        return new ResponseEntity<>("Cart Item Deleted", HttpStatus.OK);
    }
}
