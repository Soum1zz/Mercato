package com.sou.eCom.controller;


import com.sou.eCom.model.Comment;
import com.sou.eCom.model.dto.CommentRequest;
import com.sou.eCom.model.dto.CommentResponse;
import com.sou.eCom.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class CommentController {

    @Autowired
    CommentService commentService;

    @GetMapping("/product/{productId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long productId) throws IOException {
        return commentService.getProductComments(productId);
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

    @PostMapping("/product/{productId}/comments")
    public ResponseEntity<CommentResponse> save(@PathVariable long productId , @RequestParam CommentRequest commentRequest ) {
        try {
            return new ResponseEntity<>(commentService.addComment(productId, commentRequest), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/comment/{commentId}")
    public ResponseEntity<CommentResponse> update(@PathVariable long commentId ,@RequestParam CommentRequest commentRequest ) {
        try {
            return new ResponseEntity<>(commentService.updateComment(commentId, commentRequest), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/comment/{commentId}")
    public void  delete(@PathVariable long commentId) {
        commentService.deleteComment(commentId);
    }
}
