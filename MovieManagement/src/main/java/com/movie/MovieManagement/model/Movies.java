package com.movie.MovieManagement.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
public class Movies {
    @Id
    private int movieId;
    private String movieName;
    private int duration;
    private String language;
    private LocalDate releaseDate;
    private String genre;
    private float rating;

}
