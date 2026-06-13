package com.sou.eCom.repo;

import com.sou.eCom.model.PasswordReset;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PRRepo extends JpaRepository<PasswordReset, Long> {
    @Transactional
    @Modifying
    void deleteByEmail(String email);

    Optional<PasswordReset> findByToken(String token);

}
