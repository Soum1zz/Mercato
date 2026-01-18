package com.sou.eCom.scheduler;

import com.sou.eCom.model.User;
import com.sou.eCom.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.sou.eCom.model.SellerDetails.Status.PENDING;

@Service
@RequiredArgsConstructor
public class SellerCleanupJob {
    @Autowired
    UserRepo userRepo;

    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanup() {
        userRepo.deleteExpiredSellers(
                PENDING,
                LocalDateTime.now().minusDays(7)
        );
    }
}
