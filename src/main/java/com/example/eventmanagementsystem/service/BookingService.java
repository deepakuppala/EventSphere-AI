package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.repository.BookingRepository;
import com.example.eventmanagementsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    public Booking bookEvent(Booking booking) {

        Event event = eventRepository.findById(
                        booking.getEvent().getId())
                .orElseThrow(() -> new RuntimeException("Event Not Found"));

        if (event.getAvailableSeats() < booking.getNumberOfTickets()) {
            throw new RuntimeException("Seats Not Available");
        }

        event.setAvailableSeats(
                event.getAvailableSeats() - booking.getNumberOfTickets());

        eventRepository.save(event);

        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");

        booking.setTotalAmount(
                booking.getNumberOfTickets() * event.getTicketPrice());

        return bookingRepository.save(booking);
    }

    // All Bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Recent Bookings
    public List<Booking> getRecentBookings() {
        return bookingRepository.findTop10ByOrderByBookingDateDesc();
    }

    // Delete Booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}