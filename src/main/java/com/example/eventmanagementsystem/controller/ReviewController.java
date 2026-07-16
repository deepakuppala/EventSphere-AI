package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.Review;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.repository.ReviewRepository;
import com.example.eventmanagementsystem.service.EventService;
import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId).orElse(null);
        if (event == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reviewRepository.findByEventOrderByCreatedAtDesc(event));
    }

    @PostMapping("/event/{eventId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> submitReview(@PathVariable Long eventId,
                                          @RequestBody Map<String, Object> payload,
                                          Authentication authentication) {
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userService.findByEmail(userEmail);
        Event event = eventService.getEventById(eventId).orElse(null);

        if (event == null) return ResponseEntity.notFound().build();

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setRating(Integer.valueOf(payload.get("rating").toString()));
        review.setComment(payload.get("comment").toString());

        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
