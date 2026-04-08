package com.sou.eCom.controller;

import com.sou.eCom.model.Product;
import com.sou.eCom.model.dto.ProductRequest;
import com.sou.eCom.model.dto.ProductResponse;
import com.sou.eCom.model.dto.RatingResponse;
import com.sou.eCom.repo.CommentRepo;
import com.sou.eCom.repo.ProductRepo;
import com.sou.eCom.service.CommentService;
import com.sou.eCom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    CommentService commentService;
    @GetMapping("/product")
    public ResponseEntity<List<ProductResponse>> products()
    {
        List<ProductResponse> products = productService.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductResponse> product(@PathVariable long id){
        return  new ResponseEntity<>(productService.getProduct(id), HttpStatus.OK);
    }
    @GetMapping("/product/{id}/image")
    public ResponseEntity<Void> getImage(@PathVariable long id){
        String imgUrl = productService.getImage(id);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(imgUrl))
                .build();
    }
    @GetMapping("/product/search")
    public ResponseEntity<List<ProductResponse>> searchProduct(
            @RequestParam String keyword,
            @RequestParam(required = false) String category){
        return new ResponseEntity<>(productService.search(keyword, category),HttpStatus.OK);
    }

    @GetMapping("/product/category/{category}")
    public ResponseEntity<List<ProductResponse>> productsByCategory(@PathVariable("category") String category){
       return new ResponseEntity<>( productService.findByCategory(category), HttpStatus.OK);
    }

    @GetMapping("/product/{productId}/rating")
    public ResponseEntity<RatingResponse> productsByRating(@PathVariable("productId") long productId){
        try{
            return new ResponseEntity<>(commentService.getRating(productId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
}
