package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Save User
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Login
    public User login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }


    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete User
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}