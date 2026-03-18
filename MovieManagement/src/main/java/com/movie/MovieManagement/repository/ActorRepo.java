package com.movie.MovieManagement.repository;

import com.movie.MovieManagement.model.Actor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActorRepo extends JpaRepository<Actor,Integer> {
    List<Actor> findByMovieId(Integer movieId);
}
