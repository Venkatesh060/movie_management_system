package com.movie.MovieManagement.service;

import org.springframework.stereotype.Service;

import com.movie.MovieManagement.model.User;
import com.movie.MovieManagement.repository.UserRepo;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepository;

    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername()))
            throw new RuntimeException("Username already taken.");
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already registered.");
        return userRepository.save(user);
    }

    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }

    public boolean isAdmin(Integer userId) {
        return userRepository.findById(userId)
                .map(User::isAdmin)
                .orElse(false);
    }
}