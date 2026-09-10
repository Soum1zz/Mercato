package com.sou.eCom.model;

import com.sou.eCom.Status.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable=false)
    private Order order;

    private double amount;

    @Convert(converter = PaymentStatusConverter.class)
    @Column(name = "status", length = 50)
    private PaymentStatus status;

    private LocalDateTime date;

    private String  razorpayOrderId;

    private String  razorpayPaymentId;
}
