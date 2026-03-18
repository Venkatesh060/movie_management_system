package com.movie.MovieManagement.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    // Getters & Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // "ADMIN" or "USER"
    @Column(nullable = false)
    private String role = "USER";

    public User() {}

    public boolean isAdmin() { return "ADMIN".equalsIgnoreCase(this.role); }
}
