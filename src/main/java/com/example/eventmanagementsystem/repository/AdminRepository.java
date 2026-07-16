package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByUsernameAndPassword(String username, String password);

    Admin findByUsername(String username);
}