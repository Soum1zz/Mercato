package com.sou.eCom.service;

import com.sou.eCom.model.Product;
import com.sou.eCom.model.User;
import com.sou.eCom.model.dto.ProductRequest;
import com.sou.eCom.model.dto.ProductResponse;
import com.sou.eCom.repo.ProductRepo;
import com.sou.eCom.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    UserRepo userRepo;
    private ProductResponse toProductResponse(Product product) {

        return new ProductResponse(
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
    }
    public ProductResponse getProduct(long productId) {
        Product product= productRepo.findById(productId).orElseThrow(()->new RuntimeException("Product not found"));

        return toProductResponse(product);
    }

    public ProductResponse addProduct(User seller, ProductRequest req, MultipartFile img) throws IOException {
        // 1. Create a new Product entity
        Product product = new Product();

        // 2. Map data from the Request DTO to the Entity
        product.setName(req.name());
        product.setDescription(req.description());
        product.setBrand(req.brand());
        product.setCategory(req.category());
        product.setPrice(req.price());
        product.setStock(req.stock());
        product.setStatus(req.stock()>0? Product.ProductStatus.AVAILABLE: Product.ProductStatus.OUT_OF_STOCK);
        product.setReleaseDate(req.date());

        product.setSeller(seller);
        // 3. Handle the Image file if it exists
        if (img != null && !img.isEmpty()) {
            product.setImageName(img.getOriginalFilename());
            product.setImageType(img.getContentType());
            product.setImageData(img.getBytes());
        }

        // 4. Save to Database and convert the saved result to a Response DTO
        Product savedProduct = productRepo.save(product);
        return toProductResponse(savedProduct);
    }
    public ProductResponse updateProduct(long id , ProductRequest req, MultipartFile img)throws IOException {

        Product old = productRepo.findById(id).orElseThrow(()->new RuntimeException("Product not found"));

        old.setStatus(req.stock()>0? Product.ProductStatus.AVAILABLE: Product.ProductStatus.OUT_OF_STOCK);
        old.setName(req.name());
        old.setDescription(req.description());
        old.setBrand(req.brand());
        old.setStock(req.stock());
        old.setPrice(req.price());
        old.setCategory(req.category());
        old.setReleaseDate(req.date());

        if(img != null && !img.isEmpty()) {
            old.setImageName(img.getOriginalFilename());
            old.setImageType(img.getContentType());
            old.setImageData(img.getBytes());
        }

        return  toProductResponse(productRepo.save(old));
    }

    public List<ProductResponse> findAll() {
        List<Product> products = productRepo.findAll();
        List<ProductResponse> productResponses = new ArrayList<>();
        for (Product product : products) {
            productResponses.add(toProductResponse(product));
        }
        return productResponses;
    }

    public List<ProductResponse> search(String keyword ,String category) {
        String key= keyword.toLowerCase();
        String categoryName =(category==null)?null: category.toLowerCase();

        List<Product>products= productRepo.search(key,categoryName);
        List<ProductResponse> productResponses = new ArrayList<>();
        for (Product product : products) {
            productResponses.add(toProductResponse(product));
        }
        return productResponses;
    }

    public void delete(long productId) {
        productRepo.deleteById(productId);
    }

    public byte[] getImage(long id) {
        Product product = productRepo.findById(id).orElseThrow(()->new RuntimeException("Product not found"));
        return product.getImageData();
    }

    public List<ProductResponse> findByCategory(String category) {
       List<Product>products= productRepo.findByCategory(category);
       List<ProductResponse> productResponses = new ArrayList<>();
       for (Product product : products) {
           productResponses.add(toProductResponse(product));
       }
       return productResponses;
    }

    public List<ProductResponse> getAllSellersProducts(long sellerId) {
       List<ProductResponse> productResponses = new ArrayList<>();
       List<Product> products= productRepo.findBySeller_UserId(sellerId);
       for (Product product : products) {
           productResponses.add(toProductResponse(product));
       }

       return productResponses;
    }
}