package com.sou.eCom.controller;

import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.CartDto.CartResponse;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.model.dto.UserRequest;
import com.sou.eCom.model.dto.UserResponse;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.CartService;
import com.sou.eCom.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "https://localhost:5173")
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    UserRepo userRepo;
    @Autowired
    CartService cartService;
    @GetMapping("/csrf-token")
    CsrfToken gettoken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return new ResponseEntity<>(userService.getUser(principal.getUser().getUserId()), HttpStatus.OK );
    }
    @GetMapping("/user/{userId}/image")
    public ResponseEntity<Void> getCurrentUserImage(@PathVariable long userId) {
        String imgUrl= userService.getImage(userId);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(imgUrl))
                .build();
    }
    @PutMapping("/user/{userId}/image")
    public ResponseEntity<?> putCurrentUserImage(@PathVariable long userId, @RequestBody Map<String,String> body) {
        try {
            userService.putImage(userId, body.get("imgUrl"));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me/cart")
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return new ResponseEntity<>(cartService.cart(principal.getUser().getUserId()), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me/orders")
    public ResponseEntity<List<OrderResponse>> orders(@AuthenticationPrincipal UserPrincipal principal) {
        return new ResponseEntity<>(userService.getUserOrder(principal.getUser().getUserId()),HttpStatus.OK);
    }


    @PutMapping("/me")
    public  ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal UserPrincipal principal, @RequestBody UserRequest user )throws IOException {
        return new ResponseEntity<>(userService.updateUser(user,principal.getUser().getUserId()),HttpStatus.OK);
    }

}
