package com.sou.eCom.repo;

import com.sou.eCom.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepo extends JpaRepository<Comment,Long> {

       public List<Comment> findByProductId(long productId);

       public List<Comment> findByUserUserId(Long userId);
}

