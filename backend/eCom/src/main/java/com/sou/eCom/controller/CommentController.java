package com.sou.eCom.controller;


import com.sou.eCom.model.Comment;
import com.sou.eCom.model.dto.CommentRequest;
import com.sou.eCom.model.dto.CommentResponse;
import com.sou.eCom.service.CommentService;
import com.sou.eCom.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    CommentService commentService;

    @GetMapping("/product/{productId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long productId) throws IOException {
        return commentService.getProductComments(productId);
    }

    @GetMapping("/product/{productId}/user/comment")
    public ResponseEntity<?> getComments(@PathVariable Long productId, @AuthenticationPrincipal UserPrincipal userPrincipal)  {
        if (userPrincipal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try{
            return new ResponseEntity<>(commentService.getUserCommentOnProduct( userPrincipal.getUser().getUserId(), productId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/comments/{commentId}")
    public CommentResponse getComment(@PathVariable Long commentId) throws IOException {
        return commentService.getComment(commentId);
    }

    @GetMapping("/user/{userId}/comments")
    public  List<CommentResponse> getUserComments(@PathVariable Long userId) throws IOException {
        return commentService.getUserComment(userId);
    }

    @GetMapping("/comment/{commentId}/image")
    public ResponseEntity<?> getCommentImage(@PathVariable Long commentId) throws IOException {
        try{
           return new ResponseEntity<>(commentService.getImg(commentId),HttpStatus.OK) ;
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR) ;
        }
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'SELLER', 'ADMIN')")
    @PostMapping("/product/{productId}/comments")
    public ResponseEntity<?> save(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable long productId , @RequestBody CommentRequest commentRequest ) {
        try {
            return new ResponseEntity<>(commentService.addComment(userPrincipal.getUser().getUserId(),productId, commentRequest), HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'SELLER', 'ADMIN')")
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<?> update(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable long commentId ,@RequestBody CommentRequest commentRequest ) {
        try {
            return new ResponseEntity<>(commentService.updateComment(userPrincipal.getUser().getUserId(), commentId, commentRequest), HttpStatus.OK);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'SELLER', 'ADMIN')")
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable long commentId) {
        try {
            boolean isAdmin = userPrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            commentService.deleteComment(userPrincipal.getUser().getUserId(), commentId, isAdmin);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
