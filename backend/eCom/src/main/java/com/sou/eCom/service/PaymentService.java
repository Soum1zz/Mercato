package com.sou.eCom.service;


import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class PaymentService {
    @Value("${razorpay.api.key}")
    private String apiKey;
    @Value("${razorpay.api.secret}")
    private String apiSecret;


    public String createOrder(double amt, String cur, String receiptId) throws RazorpayException {

        RazorpayClient rc = new RazorpayClient(apiKey, apiSecret);

        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amt * 100);
        orderReq.put("currency", cur);
        orderReq.put("receipt", receiptId);

        Order order = rc.orders.create(orderReq);

        // return the razorpay order id
        Object id = order.get("id");
        return id != null ? id.toString() : null;
    }

    /**
     * Verifies the Razorpay payment signature using HMAC-SHA256.
     * The payload is: razorpayOrderId + "|" + razorpayPaymentId
     * signed with the Razorpay API secret.
     *
     * @return true if the computed signature matches the one sent by Razorpay
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(razorpaySignature);
        } catch (Exception e) {
            return false;
        }
    }

    /** Generates a unique receipt ID for each order. */
    public static String generateReceiptId() {
        return "rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}
