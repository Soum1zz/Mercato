package com.sou.eCom.service;


import com.sou.eCom.model.PasswordReset;
import com.sou.eCom.repo.PRRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PasswordResetService {
    @Autowired
    private PRRepo prRepo;
    @Autowired
    private JavaMailSender mailSender;

    @Transactional
    public void sendEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        prRepo.deleteByEmail(email);

        String token = UUID.randomUUID().toString();

        PasswordReset pr = new PasswordReset();
        pr.setEmail(email);
        pr.setToken(token);

        prRepo.save(pr);
        SimpleMailMessage mail = new SimpleMailMessage();


        mail.setTo(email);
        mail.setSubject("Link for password reset");
        mail.setText("Hello Mercato user your password reset link is: http://localhost:5173/reset-password?token=" + token);

        mailSender.send(mail);

    }

    @Transactional
    public void verifyEmail(String token) {
        PasswordReset pr= prRepo.findByToken(token).orElseThrow(()->new RuntimeException("Token not found"));
    }
}
