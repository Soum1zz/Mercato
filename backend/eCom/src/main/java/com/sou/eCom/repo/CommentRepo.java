package com.sou.eCom.repo;

import com.sou.eCom.model.Comment;
import com.sou.eCom.model.dto.CommentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepo extends JpaRepository<Comment,Long> {

       public List<Comment> findByProductId(long productId);

       public List<Comment> findByUserUserId(Long userId);


    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.product.id = :productId")
    Double getRating(long productId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.product.id = :productId")
    Long getTotalRating(long productId);

    Optional<Comment> findByUserUserIdAndProductId(Long userId, Long productId);

}

