package com.sou.eCom.controller;

import com.sou.eCom.model.dto.UserResponse;
import com.sou.eCom.service.AdminService;
import com.sou.eCom.service.SellerService;
import com.sou.eCom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    AdminService adminService;
    @Autowired
    UserService userService;
    @Autowired
    SellerService sellerService;
    @PutMapping("/sellers/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable("id") long id){
        try{
            adminService.approveSeller(id);
            return new ResponseEntity<>("approved", HttpStatus.OK) ;
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST) ;
    }

    @GetMapping("/user/{userId}/image")
    public ResponseEntity<String> getImage(@PathVariable("userId") Long userId){
        try{
            return userService.getImage(userId);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/seller/{sellerId}/certificate")
    public ResponseEntity<?> getCertiImage(@PathVariable("sellerId") Long userId){
        try{
            String img= sellerService.getCertificateImage(userId);
            return  ResponseEntity.ok()
                    .body(img) ;
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> users(){
        return new ResponseEntity<>(userService.getAllUser(), HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserResponse> user(@PathVariable("userId") Long userId) {
        return new ResponseEntity<>(userService.getUser(userId), HttpStatus.OK);
    }
    @GetMapping("/seller/requests")
    public ResponseEntity<?> getSellerRequests(){
        try{
            return new ResponseEntity<>(sellerService.getPendingSellers(), HttpStatus.OK);
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("seller/{sellerId}/details")
    public ResponseEntity<?> getSellerDetails(@PathVariable long sellerId){
        try{

            return  ResponseEntity.ok(sellerService.getSellerDetails(sellerId));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }



}
