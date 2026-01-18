package com.sou.eCom.controller;


import com.sou.eCom.model.SellerDetails;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.ProductRequest;
import com.sou.eCom.model.dto.ProductResponse;
import com.sou.eCom.model.dto.SellerDetailReq;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.ProductService;
import com.sou.eCom.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/seller")
@PreAuthorize("hasRole('SELLER')")

public class SellerController {
    @Autowired
    ProductService productService;
    @Autowired
    SellerService sellerService;

    @GetMapping("/{sellerId}/products")
    public ResponseEntity<?>getAllSellersProducts(@PathVariable long sellerId) {
        try {
            return new ResponseEntity<>(productService.getAllSellersProducts(sellerId), HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @PostMapping(value = "/products", consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(@RequestPart("request") ProductRequest request, @RequestPart(value = "image",required = false) MultipartFile image){
        try{
            Authentication auth =
                    SecurityContextHolder.getContext().getAuthentication();

            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            ProductResponse product1=productService.addProduct(userPrincipal.getUser(),request, image);
            return new ResponseEntity<>(product1,HttpStatus.OK);
        }catch(Exception e){
            System.err.println("error");
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable long id, @RequestPart("request") ProductRequest product, @RequestPart(value = "image", required = false) MultipartFile image){
        try{
            ProductResponse updateProduct=productService.updateProduct( id, product, image);
            return new ResponseEntity<>(updateProduct,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable long id){
        try{
            productService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{sellerId}")
    public  ResponseEntity<?> uploadData(@PathVariable long sellerId, @RequestPart SellerDetailReq updateReq, @RequestPart MultipartFile imgFile){
        try{
            sellerService.setSellerDetails(sellerId, updateReq, imgFile);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/{sellerId}/details")
    public ResponseEntity<?> postSellerDetails(@PathVariable long sellerId, @RequestPart("seller") SellerDetailReq uploadReq, @RequestPart(name = "image",required = false) MultipartFile imgFile){
        try {
            sellerService.setSellerDetails(sellerId, uploadReq, imgFile);
            return ResponseEntity.ok("Seller details submitted");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/{sellerId}/details")
    public ResponseEntity<?> putSellerDetails(@PathVariable long sellerId, @RequestPart SellerDetailReq uploadReq, @RequestPart(required = false) MultipartFile imgFile){
        try {
            sellerService.setSellerDetails(sellerId, uploadReq, imgFile);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/{sellerId}/details")
    public ResponseEntity<?> getSellerDetails(@PathVariable long sellerId){
        try{

            return  ResponseEntity.ok(sellerService.getSellerDetails(sellerId));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
