package com.sou.eCom.controller;

import com.sou.eCom.model.PasswordReset;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.ResetReq;
import com.sou.eCom.repo.PRRepo;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.service.PasswordResetService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PasswordResetController {
    @Autowired
    private PasswordResetService prService;
    @Autowired
    private PRRepo  prRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @PostMapping("/link-req")
    public ResponseEntity<?> linkReq(@RequestBody ResetReq req) {
        try{
            prService.sendEmail(req.email());
            return ResponseEntity.ok("Link sent to your email: " + req.email());
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/link-veri")
    public ResponseEntity<?> linkVeri(@RequestParam String token) {
        try{
            prService.verifyEmail(token);
            return ResponseEntity.ok("Token is verified");
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody ResetReq req) {

        try {
            PasswordReset pr= prRepo.findByToken(req.token()).orElseThrow(()->new RuntimeException("Token not found"));

            User u= userRepo.findByEmail(pr.getEmail()).orElseThrow(()->new RuntimeException("User not found"));

            u.setPassword(bCryptPasswordEncoder.encode(req.pwd()));
            
            userRepo.save(u);
            prRepo.delete(pr);
            return ResponseEntity.ok("Reset Password Successfully");
        } catch (RuntimeException e) {
            e.printStackTrace(); // 👈 IMPORTANT
            return ResponseEntity.badRequest().build();
        }
    }
}
