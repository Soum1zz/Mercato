package com.sou.eCom.controller;

import com.sou.eCom.model.Otp;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.OtpReq;
import com.sou.eCom.repo.OtpRepo;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
@RestController
@RequestMapping("/api")
public class OtpController {
    @Autowired
    private OtpService otpService;
    @Autowired
    private OtpRepo otpRepo;
    @Autowired
    private UserRepo userRepo;
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody OtpReq req) {
        if(userRepo.existsByEmail(req.email())){
            return  ResponseEntity
                    .badRequest()
                    .body("Email Already Exists");
        }

        otpRepo.deleteByEmail(req.email());

        String otp = otpService.generateOtp();

        Otp ov = new Otp();
        ov.setEmail(req.email());
        ov.setOtp(otp);
        ov.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        ov.setVerified(false);

        otpRepo.save(ov);

        // send email
        otpService.send(ov.getEmail(), "Your OTP is: " + otp);

        return ResponseEntity.ok("OTP sent");
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpReq req) {

        Otp ov = otpRepo.findByEmail(req.email()).orElseThrow(()->new RuntimeException("Otp Not Found"));

        if (ov.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        if (!ov.getOtp().equals(req.otp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        otpService.deleteOtp(req.email());

        return ResponseEntity.ok("OTP verified");
    }
}
