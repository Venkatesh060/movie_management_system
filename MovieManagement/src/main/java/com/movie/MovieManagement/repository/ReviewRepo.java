package com.movie.MovieManagement.repository;

import com.movie.MovieManagement.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Integer> {
    List<Review> findByMovieId(Integer movieId);
    List<Review> findByUserUserId(Integer userId);
    boolean existsByUserUserIdAndMovieId(Integer userId, Integer movieId);
}
