package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Payment;
import com.example.eventmanagementsystem.repository.BookingRepository;
import com.example.eventmanagementsystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class TicketController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/ticket/{bookingId}")
    public String ticket(@PathVariable Long bookingId,
                         Model model){

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        Payment payment =
                paymentService.getPaymentByBooking(booking);

        model.addAttribute("booking", booking);
        model.addAttribute("payment", payment);

        return "ticket";
    }

}