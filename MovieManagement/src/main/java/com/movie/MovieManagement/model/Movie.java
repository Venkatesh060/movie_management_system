package com.movie.MovieManagement.model;




import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "movies")
public class Movie {

    // Getters & Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String movieName;

    private Integer duration;
    private String genre;
    private LocalDate releaseDate;
    private Float avgRating = 0.0f;
    private String language;
    private String posterUrl;

    public Movie() {}

}
