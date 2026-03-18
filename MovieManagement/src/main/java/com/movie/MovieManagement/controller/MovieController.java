package com.movie.MovieManagement.controller;



import com.movie.MovieManagement.model.Movie;
import com.movie.MovieManagement.service.MovieService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }


    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Integer id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/search")
    public List<Movie> searchByName(@RequestParam String name) {
        return movieService.searchByName(name);
    }


    @GetMapping("/filter")
    public List<Movie> filter(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Float minRating,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return movieService.filterMovies(genre, language, minRating, fromDate, toDate);
    }


    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movieService.addMovie(movie));
    }



    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Integer id,
                                         @RequestBody Movie updated) {
        try {
            return ResponseEntity.ok(movieService.updateMovie(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}