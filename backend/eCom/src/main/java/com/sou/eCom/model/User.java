package com.sou.eCom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    public  enum UserRole {
        ADMIN,
        CUSTOMER,
        SELLER,

    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userName;
    @Column(unique = true, nullable = false)
    private String email;
    private String phoneNumber;
    private String address;
    private int pinCode;
    private LocalDate createdOn;
    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String password;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,orphanRemoval = true)
    List<Order> orders;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,orphanRemoval = true)
    List<Comment> comments;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    Cart cart;

    //image
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;
}
