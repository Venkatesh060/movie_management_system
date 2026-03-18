package com.movie.MovieManagement.repository;

import com.movie.MovieManagement.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Integer> {

    List<Movie> findByMovieNameContainingIgnoreCase(String name);

    @Query("SELECT m FROM Movie m WHERE " +
            "(:genre     IS NULL OR LOWER(m.genre)    = LOWER(:genre))    AND " +
            "(:language  IS NULL OR LOWER(m.language) = LOWER(:language)) AND " +
            "(:minRating IS NULL OR m.avgRating       >= :minRating)      AND " +
            "(:fromDate  IS NULL OR m.releaseDate     >= :fromDate)       AND " +
            "(:toDate    IS NULL OR m.releaseDate     <= :toDate)")
    List<Movie> findByFilters(@Param("genre")     String genre,
                              @Param("language")  String language,
                              @Param("minRating") Float minRating,
                              @Param("fromDate")  LocalDate fromDate,
                              @Param("toDate")    LocalDate toDate);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.movie.id = :movieId")
    Float calculateAvgRating(@Param("movieId") Integer movieId);
}