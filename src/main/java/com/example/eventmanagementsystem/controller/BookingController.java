package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.service.BookingService;
import com.example.eventmanagementsystem.service.EventService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EventService eventService;

    @PostMapping("/booking/confirm")
    public String confirmBooking(@RequestParam Long eventId,
                                 @RequestParam Integer quantity,
                                 HttpSession session) {

        User user = (User) session.getAttribute("loggedUser");

        if (user == null) {
            return "redirect:/login";
        }

        Event event = eventService.getEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event Not Found"));

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfTickets(quantity);

        Booking savedBooking = bookingService.bookEvent(booking);

        return "redirect:/payment/" + savedBooking.getBookingId();
    }
}