package com.sou.eCom.service;

import com.sou.eCom.model.Comment;
import com.sou.eCom.model.Order;
import com.sou.eCom.model.OrderItem;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.*;
import com.sou.eCom.repo.CommentRepo;
import com.sou.eCom.repo.OrderRepo;
import com.sou.eCom.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    CommentRepo commentRepo;
    @Autowired
    OrderRepo orderRepo;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    public UserResponse toUserResponse(User user){
        UserResponse userResponse = new UserResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getPinCode(),
                String.valueOf(user.getRole())
        );
        return userResponse;
    }



    public List<UserResponse> getAllUser() {
        List<UserResponse> users = new ArrayList<>();
        List<User> userList = userRepo.findAll();
        for (User user : userList) {
            users.add(toUserResponse(user));
        }
        return users;
    }

    public UserResponse getUser(Long userId) {
        User user= userRepo.findById(userId).orElseThrow(()->new RuntimeException("User Not Found"));
        return toUserResponse(user);
    }

    public List<OrderResponse> getUserOrder(Long userId) {
        List<OrderResponse> orderResponses = new ArrayList<>();
        List<Order>orders= orderRepo.findByUser_UserId(userId);
        for (Order order : orders) {
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
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }

    public UserResponse addUser(UserRequest user, MultipartFile picture) throws IOException {
        User user1= new User();
        user1.setUserName(user.name());
        user1.setPassword(bCryptPasswordEncoder.encode(user.password()));
        user1.setEmail(user.email());
        user1.setPinCode(user.pinCode());
        user1.setAddress(user.address());
        user1.setPhoneNumber(user.phoneNumber());
        user1.setCreatedOn(LocalDate.now());
        try {
            user1.setRole(User.UserRole.valueOf(user.role().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role");
        }


        if(picture!=null){
            user1.setImageName(picture.getOriginalFilename());
            user1.setImageType(picture.getContentType());
            user1.setImageData(picture.getBytes());
        }
        User savedUser=userRepo.save(user1);


        return toUserResponse(savedUser);
    }

    public UserResponse updateUser(UserRequest user, MultipartFile picture, Long userId) throws IOException {
        User user1= userRepo.findById(userId).orElseThrow(()->new RuntimeException("User Not Found"));
        user1.setUserName(user.name());
        user1.setEmail(user.email());
        user1.setPinCode(user.pinCode());
        user1.setAddress(user.address());
        user1.setPhoneNumber(user.phoneNumber());

        if(picture!=null&& !picture.isEmpty()){
            user1.setImageName(picture.getOriginalFilename());
            user1.setImageType(picture.getContentType());
            user1.setImageData(picture.getBytes());
        }
        User updatedUser=userRepo.save(user1);
        return toUserResponse(updatedUser);
    }

    public void deleteUser(Long userId) {
        User user= userRepo.findById(userId).orElseThrow(()->new RuntimeException("User Not Found"));

        userRepo.deleteById(user.getUserId());
    }

    public List<CommentResponse> getUserComments(Long userId) {
        List<CommentResponse> commentResponses = new ArrayList<>();
        List<Comment>comments= commentRepo.findByUserUserId(userId);
        for (Comment comment : comments) {
            commentResponses.add(new CommentResponse(
                    comment.getId(),
                    comment.getCreatedDate(),
                    comment.getCommentBody(),
                    comment.getRating(),
                    comment.getUser().getUserId(),
                    comment.getUser().getUserName(),
                    comment.getImageName(),
                    comment.getImageType(),
                    comment.getImageData()
            ));

        }
        return commentResponses;
    }

    public ResponseEntity<byte[]> getImage(Long userId) {
        User user= userRepo.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        return ResponseEntity.ok()
                .header("Content-Type", user.getImageType())
                .body(user.getImageData());
    }
}
