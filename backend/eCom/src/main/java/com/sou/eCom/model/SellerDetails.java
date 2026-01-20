package com.sou.eCom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerDetails {

    public enum  Status {
        APPROVED,
        PENDING
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;
    @Enumerated(EnumType.STRING)
    private Status verificationStatus;
    private String taxId;
    private String businessDescription;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String certificateImageUrl;

}
