package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.service.BookingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/bookings")
public class AdminBookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public String bookings(HttpSession session, Model model) {

        if (session.getAttribute("loggedAdmin") == null) {
            return "redirect:/admin/login";
        }

        model.addAttribute("bookings", bookingService.getAllBookings());

        return "admin-bookings";
    }

    @GetMapping("/delete/{id}")
    public String deleteBooking(@PathVariable Long id) {

        bookingService.deleteBooking(id);

        return "redirect:/admin/bookings";
    }
}