package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Admin;
import com.example.eventmanagementsystem.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin login(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }

    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

}