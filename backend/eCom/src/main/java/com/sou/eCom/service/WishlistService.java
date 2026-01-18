package com.sou.eCom.service;

import com.sou.eCom.model.Product;
import com.sou.eCom.model.Wishlist;
import com.sou.eCom.model.dto.ProductResponse;
import com.sou.eCom.repo.ProductRepo;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.repo.WishlistRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishlistService {
    @Autowired
    WishlistRepo wishlistRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    ProductRepo productRepo;
    @Transactional
    public void updateList(Long userId,Long productId) {
            Wishlist wishlist = wishlistRepo.findByUser_UserId(userId).orElseGet(()-> {
            Wishlist list =new Wishlist();
            list.setUser(userRepo.findById(userId).orElseThrow(()->new RuntimeException("User not found!")));
            list.setProducts(new ArrayList<>());
            return wishlistRepo.save(list);
        });

            Product product=productRepo.findById(productId).orElseThrow(()->new RuntimeException("Product not found!"));
            if(!wishlist.getProducts().contains(product)){
            wishlist.getProducts().add(product);}
    }

    @Transactional
    public void deleteFromList(Long userId,Long productId) {
        Wishlist wishlist = wishlistRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("Wishlist not found"));
        List<Product> products = wishlist.getProducts();

        boolean removed= wishlist.getProducts().removeIf(product->product.getId().equals(productId));

        if(!removed){
            throw new RuntimeException("Product not found in Wishlist");
        }

    }


    public List<ProductResponse> getList(Long userId) {
        Wishlist wishlist = wishlistRepo.findByUser_UserId(userId).orElseThrow(()->new RuntimeException("Wishlist not found!"));
        List<Product>products= wishlist.getProducts();
        List<ProductResponse> productResponses=new ArrayList<>();
        for(Product product:products)
        {
            ProductResponse response= new ProductResponse(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getPrice(),
                    product.getBrand(),
                    product.getCategory(),
                    product.getStock(),
                    product.getStatus().toString(),
                    product.getImageName(),
                    product.getImageType(),
                    product.getSeller().getUserId()
            );
            productResponses.add(response);
        }
        return productResponses;
    }

    public boolean isInList(Long userId, Long productId) {
        return wishlistRepo.existsByUser_UserIdAndProducts_Id(userId,productId);
    }
}
