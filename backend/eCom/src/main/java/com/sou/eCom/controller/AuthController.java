package com.sou.eCom.controller;


import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.AuthResponse;
import com.sou.eCom.model.dto.LoginReq;
import com.sou.eCom.model.dto.UserRequest;
import com.sou.eCom.model.dto.UserResponse;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.JwtService;
import com.sou.eCom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal UserPrincipal principal){
        User user= principal.getUser();


        return  new ResponseEntity<>(new UserResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getPinCode(),
                user.getRole().name()


        ), HttpStatus.OK) ;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> addUser(@RequestBody UserRequest user ) throws IOException {
        return new ResponseEntity<>(userService.addUser(user, null),HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq req){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.email(),
                        req.password()
                )
        );
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(principal.getUser());
        String role = principal.getUser().getRole().name();
        return ResponseEntity.ok(new AuthResponse(token,role));
    }

}
