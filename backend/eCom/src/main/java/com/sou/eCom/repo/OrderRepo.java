package com.sou.eCom.repo;

import com.sou.eCom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {

    List<Order> findByUser_UserId(Long userId);
}
