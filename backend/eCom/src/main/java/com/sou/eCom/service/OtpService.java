package com.sou.eCom.service;

import com.sou.eCom.repo.OtpRepo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OtpService {

        @Autowired
        private JavaMailSender mailSender;
        @Autowired
        private OtpRepo otpRepo;

        public void send(String to, String message) {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject("OTP Verification");
            mail.setText(message);

            mailSender.send(mail);
        }
        public String generateOtp() {
        int otp = 100000 + new Random().nextInt(900000);
        return String.valueOf(otp);
    }

        @Transactional
        public void deleteOtp(String email) {
            otpRepo.deleteByEmail(email);
        }

}
