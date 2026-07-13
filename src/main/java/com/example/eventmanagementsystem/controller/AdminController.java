package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Admin;
import com.example.eventmanagementsystem.service.AdminService;
import com.example.eventmanagementsystem.service.BookingService;
import com.example.eventmanagementsystem.service.EventService;
import com.example.eventmanagementsystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AdminService adminService;

    // ===========================
    // Admin Login Page
    // ===========================
    @GetMapping("/login")
    public String adminLoginPage() {
        return "admin-login";
    }

    // ===========================
    // Admin Login Process
    // ===========================
    @PostMapping("/login")
    public String adminLogin(@RequestParam String username,
                             @RequestParam String password,
                             Model model,
                             HttpSession session) {

        Admin admin = adminService.login(username, password);

        if (admin != null) {

            session.setAttribute("loggedAdmin", admin);

            return "redirect:/admin/dashboard";
        }

        model.addAttribute("error", "Invalid Username or Password");

        return "admin-login";
    }

    // ===========================
    // Admin Dashboard
    // ===========================
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {

        Admin admin = (Admin) session.getAttribute("loggedAdmin");

        if (admin == null) {
            return "redirect:/admin/login";
        }

        model.addAttribute("admin", admin);

        model.addAttribute("users", userService.getAllUsers().size());

        model.addAttribute("events", eventService.getAllEvents().size());

        model.addAttribute("bookings", bookingService.getAllBookings().size());

        model.addAttribute("revenue", 245000);

        // Latest Bookings
        model.addAttribute("recentBookings",
                bookingService.getRecentBookings());

        return "admin-dashboard";
    }

    // ===========================
    // Logout
    // ===========================
    @GetMapping("/logout")
    public String logout(HttpSession session) {

        session.invalidate();

        return "redirect:/admin/login";
    }

}