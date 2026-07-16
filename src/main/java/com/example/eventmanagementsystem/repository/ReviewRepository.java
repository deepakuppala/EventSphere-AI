package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEventOrderByCreatedAtDesc(Event event);
}
