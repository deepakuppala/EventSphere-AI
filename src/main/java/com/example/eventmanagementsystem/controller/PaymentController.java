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
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/payment/{bookingId}")
    public String paymentPage(@PathVariable Long bookingId,
                              Model model){

        Booking booking =
                bookingRepository.findById(bookingId).orElseThrow();

        model.addAttribute("booking", booking);

        return "payment";

    }

    @PostMapping("/payment/pay")
    public String pay(@RequestParam Long bookingId,
                      @RequestParam String paymentMethod){

        Booking booking =
                bookingRepository.findById(bookingId).orElseThrow();

        Payment payment = new Payment();

        payment.setBooking(booking);

        payment.setAmount(booking.getTotalAmount());

        payment.setPaymentMethod(paymentMethod);

        paymentService.makePayment(payment);

        return "redirect:/ticket/" + booking.getBookingId();

    }

}