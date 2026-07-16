package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.repository.BookingRepository;
import com.example.eventmanagementsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    public Booking bookEvent(Booking booking) {
        Event event = eventRepository.findById(booking.getEvent().getId())
                .orElseThrow(() -> new RuntimeException("Event Not Found"));

        if (event.getAvailableSeats() < booking.getNumberOfTickets()) {
            throw new RuntimeException("Seats Not Available");
        }

        event.setAvailableSeats(event.getAvailableSeats() - booking.getNumberOfTickets());
        eventRepository.save(event);

        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");
        booking.setTotalAmount(booking.getNumberOfTickets() * event.getTicketPrice());
        booking.setQrToken(java.util.UUID.randomUUID().toString());

        Booking saved = bookingRepository.save(booking);
        
        // Broadcast to WebSocket clients
        messagingTemplate.convertAndSend("/topic/events/" + event.getId(), event);
        messagingTemplate.convertAndSend("/topic/admin/stats", "NEW_BOOKING");

        return saved;
    }

    public Booking saveBooking(Booking booking) {
        if (booking.getQrToken() == null) {
            booking.setQrToken(java.util.UUID.randomUUID().toString());
        }
        return bookingRepository.save(booking);
    }

    public Booking validateTicket(String qrToken) {
        Booking booking = bookingRepository.findByQrToken(qrToken);
        if (booking == null) {
            throw new RuntimeException("Invalid Ticket");
        }
        if (Boolean.TRUE.equals(booking.getCheckedIn())) {
            throw new RuntimeException("Ticket Already Scanned");
        }
        booking.setCheckedIn(true);
        Booking saved = bookingRepository.save(booking);
        
        // Broadcast check-in to admin dashboard
        messagingTemplate.convertAndSend("/topic/admin/attendance", saved);
        
        return saved;
    }

    public List<Booking> getBookingsByUser(com.example.eventmanagementsystem.entity.User user) {
        return bookingRepository.findByUser(user);
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