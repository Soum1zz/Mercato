package com.sou.eCom.controller;


import com.razorpay.RazorpayException;
import com.sou.eCom.model.dto.PaymentVerificationRequest;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Creates a Razorpay order. Requires a valid JWT — the authenticated user
     * must be present so anonymous callers cannot create orders.
     */
    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam double amt,
            @RequestParam String cur) {
        try {
            String orderId = paymentService.createOrder(amt, cur, PaymentService.generateReceiptId());
            return ResponseEntity.ok(orderId);
        } catch (RazorpayException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Verifies the Razorpay payment signature after a successful payment.
     * The frontend must call this before placing the order to ensure the
     * payment is genuine and not forged.
     *
     * Returns 200 OK on valid signature, 400 Bad Request on mismatch.
     */
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody PaymentVerificationRequest req) {
        boolean valid = paymentService.verifySignature(
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
        );
        if (valid) {
            return ResponseEntity.ok("Payment verified");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payment signature");
        }
    }
}
