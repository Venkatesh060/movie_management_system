package com.movie.MovieManagement.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "actors")
public class Actor {

    // Getters & Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer actorId;

    @Column(nullable = false)
    private String name;

    private LocalDate dob;

    @ManyToOne()
    @JoinColumn(name = "movie_id")
    private Movie movie;

    public Actor() {}

}

