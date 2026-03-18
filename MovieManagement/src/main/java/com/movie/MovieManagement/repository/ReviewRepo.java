package com.movie.MovieManagement.repository;

import com.movie.MovieManagement.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepo extends JpaRepository<Review,Integer> {
}
