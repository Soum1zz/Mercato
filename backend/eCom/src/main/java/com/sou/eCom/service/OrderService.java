package com.sou.eCom.service;

import com.sou.eCom.model.Order;
import com.sou.eCom.model.OrderItem;
import com.sou.eCom.model.Product;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.OrderItemRequest;
import com.sou.eCom.model.dto.OrderItemResponse;
import com.sou.eCom.model.dto.OrderRequest;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.repo.OrderRepo;
import com.sou.eCom.repo.ProductRepo;
import com.sou.eCom.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private UserRepo userRepo;


    public List<OrderResponse> getAllOrderResponses() {

        List<Order> orders= orderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();
        for (Order order : orders) {

            orderResponses.add(toOrderResponse(order));
        }
        return orderResponses;

    }

    private static OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse>itemResponses = new ArrayList<>();
        for(OrderItem orderItem : order.getOrderItems()) {
            OrderItemResponse orderItemResponse= new OrderItemResponse(
                    orderItem.getProduct().getName(),
                    orderItem.getQuantity(),
                    orderItem.getTotalPrice()
            );
            itemResponses.add(orderItemResponse);
        }
        OrderResponse orderResponse = new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getOrderDate(),
                order.getTotalAmount(),
                itemResponses
        );
        return orderResponse;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId,OrderRequest req) {
        User user = userRepo.findByUserId(userId)
                .orElseThrow(()->new RuntimeException("User Not Found"));
        Order order = new Order();

        order.setUser(user);
        order.setStatus(Order.OrderStatus.PLACED);
        order.setOrderDate(LocalDate.now());
        double total=0;
        List<OrderItem> orderItems = new ArrayList<>();
        for(OrderItemRequest itemReq : req.items()) {
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(()->new RuntimeException("Product not found"));
            if (product.getStock() < itemReq.productQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getName()
                );
            }
            product.setStock(product.getStock()-itemReq.productQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.productQuantity())
                    .totalPrice(product.getPrice()*itemReq.productQuantity())
                    .order(order)
                    .build();
            orderItems.add(orderItem);
            total+=orderItem.getTotalPrice();
        }
        order.setTotalAmount(total);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepo.save(order);

       return toOrderResponse(savedOrder);

    }

    public OrderResponse getOrderById(Long orderId) {

        Order order = orderRepo.findById(orderId).orElseThrow(()->new RuntimeException("Order not found"));

        return  toOrderResponse(order);
    }

    public void deleteOrder(Long orderId) {

        Order order = orderRepo.findById(orderId).orElseThrow(()->new RuntimeException("Order not found"));
        orderRepo.delete(order);

    }
}
