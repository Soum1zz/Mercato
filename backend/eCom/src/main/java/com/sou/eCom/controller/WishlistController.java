package com.sou.eCom.controller;

import com.sou.eCom.model.Wishlist;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/me/product/{productId}/wishlist")
    public ResponseEntity<?> getWishlist( @AuthenticationPrincipal UserPrincipal principal ,@PathVariable("productId") Long productId){
        try{
            boolean wishlisted = wishlistService.isInList(principal.getUser().getUserId(),productId);
            return ResponseEntity.ok(Map.of("wishlisted", wishlisted));
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/me/wishlist")
    public ResponseEntity<?> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        try{

            return new ResponseEntity<>(wishlistService.getList(principal.getUser().getUserId()),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/me/product/{productId}/wishlist")
    public ResponseEntity<?> updateWishlist(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long productId) {
        try{
            wishlistService.updateList(principal.getUser().getUserId(), productId);
            return new ResponseEntity<>( HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/me/product/{productId}/wishlist")
    public ResponseEntity<?> deleteFromWishlist(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long productId) {
        try{
            wishlistService.deleteFromList(principal.getUser().getUserId(), productId);
            return new ResponseEntity<>( HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
