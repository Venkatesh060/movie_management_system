package com.movie.MovieManagement.service;

import com.movie.MovieManagement.model.Movie;
import com.movie.MovieManagement.model.Review;
import com.movie.MovieManagement.model.User;
import com.movie.MovieManagement.repository.MovieRepo;
import com.movie.MovieManagement.repository.ReviewRepo;
import com.movie.MovieManagement.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepo reviewRepository;
    private final UserRepo   userRepository;
    private final MovieRepo  movieRepository;
    private final MovieService     movieService;

    public ReviewService(ReviewRepo reviewRepository,
                         UserRepo userRepository,
                         MovieRepo movieRepository,
                         MovieService movieService) {
        this.reviewRepository = reviewRepository;
        this.userRepository   = userRepository;
        this.movieRepository  = movieRepository;
        this.movieService     = movieService;
    }

    @Transactional
    public Review addReview(Integer userId, Integer movieId, String text, Integer rating) {
        if (rating < 1 || rating > 5)
            throw new RuntimeException("Rating must be 1–5.");
        if (reviewRepository.existsByUserUserIdAndMovieId(userId, movieId))
            throw new RuntimeException("You have already reviewed this movie.");

        User  user  = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found: " + movieId));

        Review review = new Review();
        review.setUser(user);
        review.setMovie(movie);
        review.setReview(text);
        review.setRating(rating);

        Review saved = reviewRepository.save(review);
        movieService.refreshAvgRating(movieId);
        return saved;
    }

    public List<Review> getReviewsForMovie(Integer movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    @Transactional
    public void deleteReview(Integer reviewId, Integer requestingUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));

        boolean isOwner = review.getUser().getUserId().equals(requestingUserId);
        boolean isAdmin = userRepository.findById(requestingUserId)
                .map(User::isAdmin).orElse(false);

        if (!isOwner && !isAdmin)
            throw new RuntimeException("Not authorised to delete this review.");

        Integer movieId = review.getMovie().getId();
        reviewRepository.deleteById(reviewId);
        movieService.refreshAvgRating(movieId);
    }
}
