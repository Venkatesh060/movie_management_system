package com.movie.MovieManagement.model;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "reviews")
public class Review {

    // Getters & Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    @Column(nullable = false)
    private String review;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    private LocalDateTime createdAt;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne()
    @JoinColumn(name = "movie_id")
    private Movie movie;

    public Review() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
