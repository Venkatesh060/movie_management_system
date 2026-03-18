package com.movie.MovieManagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "actors")

public class Actors {
    @Id
    private int actorId;
    private String name;
    @JoinColumn(name = "movieId")
    private Movies movieId;
    private LocalDate dob;
}
