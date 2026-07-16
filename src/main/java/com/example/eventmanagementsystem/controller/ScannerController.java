package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/scanner")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ScannerController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/checkin/{qrToken}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkInTicket(@PathVariable String qrToken) {
        Booking booking = bookingRepository.findByQrToken(qrToken);
        
        Map<String, Object> response = new HashMap<>();
        
        if (booking == null) {
            response.put("success", false);
            response.put("message", "Invalid Ticket: QR code not found.");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (Boolean.TRUE.equals(booking.getCheckedIn())) {
            response.put("success", false);
            response.put("message", "Ticket already checked in!");
            response.put("booking", booking);
            return ResponseEntity.badRequest().body(response);
        }
        
        if (!"CONFIRMED".equals(booking.getBookingStatus())) {
            response.put("success", false);
            response.put("message", "Ticket is not confirmed (Status: " + booking.getBookingStatus() + ")");
            return ResponseEntity.badRequest().body(response);
        }

        booking.setCheckedIn(true);
        bookingRepository.save(booking);

        response.put("success", true);
        response.put("message", "Successfully checked in!");
        response.put("booking", booking);

        return ResponseEntity.ok(response);
    }
}
