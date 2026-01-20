package com.sou.eCom.service;

import com.sou.eCom.model.Comment;
import com.sou.eCom.model.Product;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.CommentRequest;
import com.sou.eCom.model.dto.CommentResponse;
import com.sou.eCom.repo.CommentRepo;
import com.sou.eCom.repo.ProductRepo;
import com.sou.eCom.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProductRepo productRepo;

    public CommentResponse addComment(long productId, CommentRequest commentRequest) throws IOException {
        Comment comment = new Comment();
        Product product = productRepo.findById(productId).orElseThrow(()->new RuntimeException("product not found"));
        User user =userRepo.findByUserId(commentRequest.userId()).orElseThrow(()->new RuntimeException("user not found"));



            comment.setProduct(product);
            comment.setUser(user);
            comment.setCommentBody(commentRequest.desc());
            comment.setRating(commentRequest.rating());
            comment.setCreatedDate(LocalDate.now());
        if(commentRequest.imgUrl() != null && !commentRequest.imgUrl().isEmpty())
        {
            comment.setImageUrl(commentRequest.imgUrl());
        }
        commentRepo.save(comment);
        return toCommentResponse(comment);


    }

    public CommentResponse updateComment(long commentId, CommentRequest commentRequest) throws IOException {
            Comment oldComment= commentRepo.findById(commentId).orElseThrow(()->new RuntimeException("comment not found"));
            oldComment.setRating(commentRequest.rating());
            oldComment.setCommentBody(commentRequest.desc());
        if(commentRequest.imgUrl() != null && !commentRequest.imgUrl().isEmpty())
        {
            oldComment.setImageUrl(commentRequest.imgUrl());
        }

        commentRepo.save(oldComment);
        return toCommentResponse(oldComment);
    }

    private CommentResponse toCommentResponse( Comment oldComment) throws IOException {

        CommentResponse commentResponse = new CommentResponse(
                oldComment.getId(),
                oldComment.getCreatedDate(),
                oldComment.getCommentBody(),
                oldComment.getRating(),
                oldComment.getUser().getUserId(),
                oldComment.getUser().getUserName()

        );

        return commentResponse;
    }

    public List<CommentResponse> getProductComments(long productId) throws IOException {
        List<Comment>comments=  commentRepo.findByProductId(productId);
        List<CommentResponse>commentResponses=new ArrayList<>();
        for( Comment comment:comments){
            commentResponses.add(toCommentResponse(comment));

        }
        return commentResponses;
    }

    public void deleteComment(long commentId) {
        Comment com=commentRepo.findById(commentId).orElseThrow(()->new RuntimeException("comment not found"));

        commentRepo.deleteById(commentId);
    }

    public CommentResponse getComment(Long commentId) throws IOException {
        Comment comment= commentRepo.findById(commentId).orElseThrow(()->new RuntimeException("comment not found"));
        return toCommentResponse(comment);
    }

    public List<CommentResponse> getUserComment(Long userId) throws IOException {
        List<Comment>comments= commentRepo.findByUserUserId(userId);
        List<CommentResponse>commentResponses=new ArrayList<>();
        for( Comment comment:comments){
            commentResponses.add(toCommentResponse(comment));

        }
        return commentResponses;
    }

    public String getImg(Long commentId) {
        Comment comment=commentRepo.findById(commentId).orElseThrow(()->new RuntimeException("comment not found"));
        return comment.getImageUrl();
    }
}
