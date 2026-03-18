package com.movie.MovieManagement.controller;

import com.movie.MovieManagement.model.Actor;
import com.movie.MovieManagement.model.Movie;
import com.movie.MovieManagement.repository.ActorRepo;
import com.movie.MovieManagement.repository.MovieRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actors")
public class ActorController {
    private final ActorRepo actorRepo;
    private final MovieRepo movieRepo;

    public ActorController(ActorRepo actorRepo, MovieRepo movieRepo) {
        this.actorRepo = actorRepo;
        this.movieRepo = movieRepo;
    }
    @GetMapping("/movies/{movieId}")
    public List<Actor> getByMovie(@PathVariable Integer movieId){
        return actorRepo.findByMovieId(movieId);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Actor> getById(@PathVariable Integer id){
        return actorRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<?> addActor(@RequestBody Actor actor){
        if(actor.getMovie()!=null && actor.getMovie().getId()!=null){
            Movie movie=movieRepo.findById(actor.getMovie().getId())
                    .orElseThrow(() -> new RuntimeException("Movie Not Found."));
            actor.setMovie(movie);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(actorRepo.save(actor));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActor(@PathVariable Integer id){
        if(!actorRepo.existsById(id))
            return ResponseEntity.notFound().build();
        actorRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }



}
