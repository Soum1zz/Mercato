package com.sou.eCom.repo;

import com.sou.eCom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {
    @Query("""
SELECT p FROM Product p
WHERE (
    LOWER(p.name) LIKE CONCAT('%', :key, '%') OR
    LOWER(p.description) LIKE CONCAT('%', :key, '%') OR
    LOWER(p.brand) LIKE CONCAT('%', :key, '%')
)
AND (:category IS NULL OR LOWER(p.category) = :category)
""")

    List<Product> search(@Param("key") String key,@Param("category")String category);

    List<Product> findByCategory(String category);

    List<Product> findBySeller_UserId(long sellerId);
}
