package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Notification;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.repository.NotificationRepository;
import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userService.findByEmail(email);
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(Map.of(
            "notifications", notifications,
            "unreadCount", notificationRepository.countByUserAndIsReadFalse(user)
        ));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<?> markAllRead(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userService.findByEmail(email);
        List<Notification> all = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        all.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(all);
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }
}
