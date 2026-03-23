package com.movie.MovieManagement.controller;

import com.movie.MovieManagement.model.Review;
import com.movie.MovieManagement.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // GET /api/reviews/movie/1
    @GetMapping("/movie/{movieId}")
    public List<Review> getByMovie(@PathVariable Integer movieId) {
        return reviewService.getReviewsForMovie(movieId);
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> body) {
        try {
            Integer userId  = (Integer) body.get("userId");
            Integer movieId = (Integer) body.get("movieId");
            String  text    = (String)  body.get("review");
            Integer rating  = (Integer) body.get("rating");

            Review saved = reviewService.addReview(userId, movieId, text, rating);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/reviews/1?requestingUserId=1
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer reviewId,
                                          @RequestParam Integer requestingUserId) {
        try {
            reviewService.deleteReview(reviewId, requestingUserId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
