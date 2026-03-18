package com.movie.MovieManagement.service;



import com.movie.MovieManagement.model.Movie;
import com.movie.MovieManagement.repository.MovieRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepo movieRepo;

    public MovieService(MovieRepo movieRepo) {
        this.movieRepo = movieRepo;
    }

    public Movie addMovie(Movie movie) {
        return movieRepo.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepo.findAll();
    }

    public Optional<Movie> getMovieById(Integer id) {
        return movieRepo.findById(id);
    }

    public List<Movie> searchByName(String name) {
        return movieRepo.findByMovieNameContainingIgnoreCase(name);
    }

    public List<Movie> filterMovies(String genre, String language,
                                    Float minRating, LocalDate fromDate, LocalDate toDate) {
        return movieRepo.findByFilters(genre, language, minRating, fromDate, toDate);
    }

    @Transactional
    public Movie updateMovie(Integer id, Movie updated) {
        Movie movie = movieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found: " + id));

        if (updated.getMovieName()   != null) movie.setMovieName(updated.getMovieName());
        if (updated.getDuration()    != null) movie.setDuration(updated.getDuration());
        if (updated.getGenre()       != null) movie.setGenre(updated.getGenre());
        if (updated.getReleaseDate() != null) movie.setReleaseDate(updated.getReleaseDate());
        if (updated.getLanguage()    != null) movie.setLanguage(updated.getLanguage());
        if (updated.getPosterUrl()   != null) movie.setPosterUrl(updated.getPosterUrl());

        return movieRepo.save(movie);
    }

    public void deleteMovie(Integer id) {
        if (!movieRepo.existsById(id))
            throw new RuntimeException("Movie not found: " + id);
        movieRepo.deleteById(id);
    }

    @Transactional
    public void refreshAvgRating(Integer movieId) {
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found: " + movieId));
        movie.setAvgRating(movieRepo.calculateAvgRating(movieId));
        movieRepo.save(movie);
    }
}