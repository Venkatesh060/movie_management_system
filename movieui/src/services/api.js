import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// Movies
export const getAllMovies    = ()           => api.get('/movies');
export const getMovieById   = (id)         => api.get(`/movies/${id}`);
export const searchMovies   = (name)       => api.get(`/movies/search?name=${name}`);
export const filterMovies   = (params)     => api.get('/movies/filter', { params });
export const addMovie       = (movie)      => api.post('/movies', movie);
export const updateMovie    = (id, movie)  => api.put(`/movies/${id}`, movie);
export const deleteMovie    = (id)         => api.delete(`/movies/${id}`);

// Actors
export const getActorsByMovie = (movieId) => api.get(`/actors/movies/${movieId}`);
export const addActor         = (actor)   => api.post('/actors', actor);
export const deleteActor      = (id)      => api.delete(`/actors/${id}`);

// Reviews
export const getReviewsByMovie = (movieId)              => api.get(`/reviews/movie/${movieId}`);
export const addReview         = (data)                 => api.post('/reviews', data);
export const deleteReview      = (reviewId, userId)     => api.delete(`/reviews/${reviewId}?requestingUserId=${userId}`);
