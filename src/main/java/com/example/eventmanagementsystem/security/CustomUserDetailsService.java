package com.example.eventmanagementsystem.security;

import com.example.eventmanagementsystem.entity.Admin;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.repository.AdminRepository;
import com.example.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // Check if Admin
        Admin admin = adminRepository.findByUsername(username);
        if (admin != null) {
            return new org.springframework.security.core.userdetails.User(admin.getUsername(), admin.getPassword(), new ArrayList<>());
        }

        // Check if User (using email as username)
        User user = userRepository.findByEmail(username);
        if (user != null) {
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
