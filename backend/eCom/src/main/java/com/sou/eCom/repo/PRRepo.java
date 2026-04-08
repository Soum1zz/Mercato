package com.sou.eCom.repo;

import com.sou.eCom.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PRRepo extends JpaRepository<PasswordReset, Integer> {
    void deleteByEmail(String email);

    Optional<PasswordReset> findByToken(String token);

}
