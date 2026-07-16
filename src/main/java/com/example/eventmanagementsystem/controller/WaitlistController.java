package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.entity.Waitlist;
import com.example.eventmanagementsystem.repository.WaitlistRepository;
import com.example.eventmanagementsystem.service.EventService;
import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/waitlist")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WaitlistController {

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @PostMapping("/{eventId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> joinWaitlist(@PathVariable Long eventId, Authentication authentication) {
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userService.findByEmail(userEmail);
        Event event = eventService.getEventById(eventId).orElse(null);

        Map<String, String> response = new HashMap<>();

        if (user == null || event == null) {
            response.put("error", "Invalid user or event");
            return ResponseEntity.badRequest().body(response);
        }

        if (event.getAvailableSeats() != null && event.getAvailableSeats() > 0) {
            response.put("message", "Event is not sold out yet! Book your ticket now.");
            return ResponseEntity.badRequest().body(response);
        }

        Waitlist waitlist = new Waitlist(user, event);
        waitlistRepository.save(waitlist);

        response.put("message", "Successfully joined the waitlist! We will notify you if a spot opens up.");
        return ResponseEntity.ok(response);
    }
}
