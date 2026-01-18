package com.sou.eCom.service;

import com.sou.eCom.model.*;
import com.sou.eCom.model.dto.CartDto.CartItemResponse;
import com.sou.eCom.model.dto.CartDto.CartResponse;
import com.sou.eCom.model.dto.CartDto.UpdateToCartRequest;
import com.sou.eCom.model.dto.OrderItemResponse;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {
    @Autowired
    CartRepo cartRepo;
    @Autowired
    ProductRepo productRepo;
    @Autowired
    OrderRepo orderRepo;
    @Autowired
    UserRepo userRepo;
    public void deleteCart(Long userId) {
        cartRepo.delete(cartRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("cart not found")));
    }


    private CartResponse toCartResponse(Cart cart) {
        List<CartItem> cartItems= cart.getItems();
        List<CartItemResponse> cartItemResponses = new ArrayList<>();
        double totalPrice= 0.0;
        for (CartItem cartItem : cartItems) {
            CartItemResponse cartItemResponse= new CartItemResponse(
                    cartItem.getProduct().getId(),
                    cartItem.getProduct().getName(),
                    cartItem.getProduct().getPrice(),
                    cartItem.getQuantity(),
                    cartItem.getProduct().getPrice()*
                            cartItem.getQuantity()

            );

            cartItemResponses.add(cartItemResponse);
            totalPrice+=cartItem.getQuantity()*cartItem.getProduct().getPrice();
        }

        return new CartResponse(
                cart.getUser().getUserId(),
                cartItemResponses,
                totalPrice
        );
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


    public CartResponse cart(Long userId) {
        Cart cart= cartRepo.findByUser_UserId(userId).orElseThrow(()-> new RuntimeException("cart not found"));
        return toCartResponse(cart);

    }
    @Transactional
    public CartResponse updateCart(Long userId, UpdateToCartRequest request) {

        Cart cart= cartRepo.findByUser_UserId(userId).orElseGet(()-> {
            Cart newCart =new Cart();
            User user= userRepo.findByUserId(userId).orElseThrow(()->new RuntimeException("user not found"));
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            return cartRepo.save(newCart);
        });

        Product product= productRepo.findById(request.productId()).orElseThrow(()-> new RuntimeException("product not found"));

        CartItem existingItem= cart.getItems().stream()
                        .filter(item -> item.getProduct().getId().equals(product.getId())).findFirst().orElse(null);

         if(request.quantity()==0&& existingItem!=null){
            cart.getItems().remove(existingItem);
        }
        else if(existingItem!=null){
            existingItem.setQuantity(request.quantity()+existingItem.getQuantity());
        }
        else{
            cart.getItems().add(CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.quantity())
                    .build()
            );
        }
        cartRepo.save(cart);
        return toCartResponse(cart);

    }

    public void deleteCartItem(Long userId, Long productId) {
        Cart cart = cartRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("cart not found"));
        CartItem cartItem= cart.getItems().stream().filter(item -> item.getProduct().getId().equals(productId)).findFirst().orElseThrow(()->new RuntimeException("product not found"));
        cart.getItems().remove(cartItem);

        cartRepo.save(cart);
    }

    @Transactional
    public OrderResponse postOrder(Long userId) {


        Cart cart=cartRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("cart not found"));
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with empty cart");
        }
        List<CartItem> cartItem=cart.getItems();
        List<OrderItem> orderItems=new ArrayList<>();
        double totalPrice=0.0;
        for (CartItem cartItem1 : cartItem) {
            Product product=cartItem1.getProduct();
            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem1.getQuantity());
            if(product.getStock()<cartItem1.getQuantity()){
                throw new RuntimeException(
                        "Insufficient stock for order item "+product.getName()
                );
            }

            product.setStock(product.getStock()-orderItem.getQuantity());

            orderItem.setTotalPrice(cartItem1.getProduct().getPrice()*cartItem1.getQuantity());
            totalPrice+= orderItem.getTotalPrice();
            orderItems.add(orderItem);
        }
        Order order= new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDate.now());
        order.setOrderItems(orderItems);
        order.setStatus(Order.OrderStatus.PLACED);
        order.setTotalAmount(totalPrice);
        orderItems.forEach(item -> item.setOrder(order));
        Order savedOrder=orderRepo.save(order);

        cart.getItems().clear();
        return toOrderResponse(savedOrder);
    }
}
