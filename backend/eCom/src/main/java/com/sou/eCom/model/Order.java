package com.sou.eCom.model;

import com.sou.eCom.Status.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name ="orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//    @Column(unique = true)
//    private String orderId;

    @Convert(converter = OrderStatusConverter.class)
    @Column(name = "status", length = 50)
    private OrderStatus status;
    private LocalDate orderDate;
    private double totalAmount;

    @OneToMany(mappedBy = "order" , cascade= CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;




}
