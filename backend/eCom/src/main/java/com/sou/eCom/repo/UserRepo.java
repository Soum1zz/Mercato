package com.sou.eCom.repo;

import com.sou.eCom.model.SellerDetails;
import com.sou.eCom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    public Optional<User> findByUserId(long userId);


    Optional<User> findByEmail(String email);
    @Modifying
    @Query("""
            DELETE FROM User u
            WHERE u.userId IN(
            SELECT sd.user.userId
            FROM SellerDetails sd
            WHERE sd.verificationStatus = :status
            AND u.createdOn< :date
            )
            """)
    void deleteExpiredSellers(@Param("status") SellerDetails.Status status,@Param("date") LocalDateTime date);
}
