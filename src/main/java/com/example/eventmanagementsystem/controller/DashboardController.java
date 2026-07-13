package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.dto.DashboardDTO;
import com.example.eventmanagementsystem.entity.Payment;
import com.example.eventmanagementsystem.repository.BookingRepository;
import com.example.eventmanagementsystem.repository.EventRepository;
import com.example.eventmanagementsystem.repository.PaymentRepository;
import com.example.eventmanagementsystem.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/stats")
    public DashboardDTO stats() {

        DashboardDTO dto = new DashboardDTO();

        dto.setUsers(userRepository.count());
        dto.setEvents(eventRepository.count());
        dto.setBookings(bookingRepository.count());

        double revenue = paymentRepository.findAll()
                .stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        dto.setRevenue(revenue);

        return dto;
    }
}