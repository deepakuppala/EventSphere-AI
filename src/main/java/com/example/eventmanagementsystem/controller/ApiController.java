package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.entity.Venue;
import com.example.eventmanagementsystem.entity.Waitlist;
import com.example.eventmanagementsystem.repository.WaitlistRepository;
import com.example.eventmanagementsystem.security.JwtUtil;
import com.example.eventmanagementsystem.security.CustomUserDetailsService;
import com.example.eventmanagementsystem.service.EmailService;
import com.example.eventmanagementsystem.service.EventService;
import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class ApiController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private com.example.eventmanagementsystem.service.BookingService bookingService;
    
    @Autowired
    private com.example.eventmanagementsystem.service.PaymentService paymentService;

    @Autowired
    private com.example.eventmanagementsystem.service.AdminService adminService;

    @Autowired
    private com.example.eventmanagementsystem.service.VenueService venueService;
    
    @Autowired
    private com.example.eventmanagementsystem.service.CategoryService categoryService;

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.example.eventmanagementsystem.repository.NotificationRepository notificationRepository;

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Email or Password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails, "USER");
        
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            User user = userService.findByEmail(email); // Need to implement this if it doesn't exist, else use repository
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userService.findByEmail(email);
        if (payload.containsKey("name")) user.setName(payload.get("name").toString());
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/bookings")
    public ResponseEntity<?> getUserBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(bookingService.getBookingsByUser(user));
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody java.util.Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Please login to book tickets");
        }

        try {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            User user = userService.findByEmail(email);

            Long eventId = Long.valueOf(payload.get("eventId").toString());
            Integer numberOfTickets = Integer.valueOf(payload.get("numberOfTickets").toString());
            Double totalAmount = Double.valueOf(payload.get("totalAmount").toString());
            String paymentMethod = payload.get("paymentMethod").toString();

            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            if (event.getAvailableSeats() < numberOfTickets) {
                return ResponseEntity.badRequest().body("Not enough available seats");
            }

            // Create Booking
            com.example.eventmanagementsystem.entity.Booking booking = new com.example.eventmanagementsystem.entity.Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setBookingDate(java.time.LocalDateTime.now()); 
            booking.setNumberOfTickets(numberOfTickets);
            booking.setTotalAmount(totalAmount);
            booking.setBookingStatus("CONFIRMED");

            com.example.eventmanagementsystem.entity.Booking savedBooking = bookingService.saveBooking(booking);

            // Deduct Seats
            event.setAvailableSeats(event.getAvailableSeats() - numberOfTickets);
            
            // Save Taken Seats (Simple JSON string manipulation to avoid Jackson dependency issues)
            if (payload.containsKey("selectedSeats")) {
                try {
                    List<Map<String, Integer>> newSeats = (List<Map<String, Integer>>) payload.get("selectedSeats");
                    StringBuilder sb = new StringBuilder();
                    String existing = event.getSeatMapState();
                    
                    if (existing != null && existing.trim().startsWith("[")) {
                        existing = existing.trim();
                        if (existing.length() > 2) { // more than just "[]"
                            sb.append(existing.substring(0, existing.length() - 1)).append(",");
                        } else {
                            sb.append("[");
                        }
                    } else {
                        sb.append("[");
                    }
                    
                    for (int i = 0; i < newSeats.size(); i++) {
                        Map<String, Integer> seat = newSeats.get(i);
                        sb.append("{\"r\":").append(seat.get("r")).append(",\"c\":").append(seat.get("c")).append("}");
                        if (i < newSeats.size() - 1) sb.append(",");
                    }
                    sb.append("]");
                    event.setSeatMapState(sb.toString());
                } catch(Exception e) {
                    System.err.println("Failed to parse seat map state: " + e.getMessage());
                }
            }

            eventService.saveEvent(event);

            // Create Payment
            com.example.eventmanagementsystem.entity.Payment payment = new com.example.eventmanagementsystem.entity.Payment();
            payment.setBooking(savedBooking);
            payment.setPaymentDate(java.time.LocalDateTime.now());
            payment.setAmount(totalAmount);
            payment.setPaymentMethod(paymentMethod);
            payment.setPaymentStatus("COMPLETED");
            paymentService.makePayment(payment);

            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing booking: " + e.getMessage());
        }
    }

    @Autowired
    private com.example.eventmanagementsystem.service.QRCodeService qrCodeService;

    @GetMapping("/bookings/{id}/qr")
    public ResponseEntity<?> getBookingQR(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        
        com.example.eventmanagementsystem.entity.Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> b.getBookingId().equals(id))
                .findFirst().orElse(null);

        if (booking == null) return ResponseEntity.notFound().build();
        
        String qrBase64 = qrCodeService.generateQRCodeBase64(booking.getQrToken());
        Map<String, String> response = new HashMap<>();
        response.put("qrCode", qrBase64);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/validate-ticket")
    public ResponseEntity<?> validateTicket(@RequestBody Map<String, String> payload) {
        try {
            String token = payload.get("qrToken");
            com.example.eventmanagementsystem.entity.Booking booking = bookingService.validateTicket(token);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody com.example.eventmanagementsystem.entity.Admin loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Admin Credentials");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails, "ADMIN");
        
        com.example.eventmanagementsystem.entity.Admin admin = adminService.login(loginRequest.getUsername(), loginRequest.getPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("admin", admin);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/me")
    public ResponseEntity<?> getCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            return ResponseEntity.ok(adminService.findByUsername(username)); // Need to implement findByUsername
        }
        return ResponseEntity.status(401).body("Not authenticated as admin");
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminStats() {
        int usersCount = userService.getAllUsers().size();
        int eventsCount = eventService.getAllEvents().size();
        int bookingsCount = bookingService.getAllBookings().size();
        Double totalRevenue = paymentService.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("users", usersCount);
        stats.put("events", eventsCount);
        stats.put("bookings", bookingsCount);
        stats.put("revenue", totalRevenue);
        stats.put("recentBookings", bookingService.getRecentBookings());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin/users")
    public ResponseEntity<?> getAdminUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<?> getAdminBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/admin/venues")
    public ResponseEntity<?> getAdminVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/admin/categories")
    public ResponseEntity<?> getAdminCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @PostMapping("/admin/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        eventService.saveEvent(event);
        
        Map<String, String> toast = new HashMap<>();
        toast.put("title", "New Event Announced! \uD83D\uDD25");
        toast.put("message", "Tickets for " + event.getEventName() + " are now on sale!");
        toast.put("type", "info");
        messagingTemplate.convertAndSend("/topic/global", toast);
        
        return ResponseEntity.ok(event);
    }

    @PutMapping("/admin/events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updated = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();

        com.example.eventmanagementsystem.entity.Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> b.getBookingId().equals(id))
                .findFirst().orElse(null);

        if (booking == null) return ResponseEntity.notFound().build();

        // Return seats
        Event event = booking.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + booking.getNumberOfTickets());
        eventService.saveEvent(event);

        // Mark booking cancelled
        booking.setBookingStatus("CANCELLED");
        bookingService.saveBooking(booking);

        // Notify first person on waitlist
        List<Waitlist> waitlist = waitlistRepository.findByEventAndNotifiedFalseOrderByJoinedAtAsc(event);
        if (!waitlist.isEmpty()) {
            Waitlist nextUser = waitlist.get(0);
            nextUser.setNotified(true);
            waitlistRepository.save(nextUser);
            String url = "http://localhost:5173/booking/" + event.getId();
            emailService.sendWaitlistNotification(
                    nextUser.getUser().getEmail(),
                    event.getEventName(),
                    url
            );
        }

        return ResponseEntity.ok("Booking cancelled successfully.");
    }

    @PostMapping("/admin/scanner/checkin/{token}")
    public ResponseEntity<?> scanBooking(@PathVariable String token) {
        com.example.eventmanagementsystem.entity.Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> token.equals(b.getQrToken()))
                .findFirst().orElse(null);

        if (booking == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Booking not found or Invalid QR"));
        }

        if (booking.isScanned()) {
            return ResponseEntity.status(400).body(Map.of("message", "Ticket has already been scanned!"));
        }

        booking.setScanned(true);
        bookingService.saveBooking(booking);
        return ResponseEntity.ok(Map.of("message", "Ticket successfully scanned and validated!", "booking", booking));
    }

    @GetMapping("/user/recommendations")
    public ResponseEntity<?> getRecommendations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.findByEmail(auth.getName());
        if (user == null) return ResponseEntity.status(401).build();

        List<com.example.eventmanagementsystem.entity.Booking> userBookings = bookingService.getBookingsByUser(user);
        List<Event> allEvents = eventService.getAllEvents();

        if (userBookings.isEmpty()) {
            // No history, return 3 random or most recent events
            List<Event> recommendations = allEvents.stream().limit(3).toList();
            return ResponseEntity.ok(recommendations);
        }

        // Find most frequent category
        Map<Long, Integer> categoryCounts = new HashMap<>();
        for (com.example.eventmanagementsystem.entity.Booking b : userBookings) {
            if (b.getEvent() != null && b.getEvent().getCategory() != null) {
                Long catId = b.getEvent().getCategory().getId();
                categoryCounts.put(catId, categoryCounts.getOrDefault(catId, 0) + 1);
            }
        }

        Long topCategoryId = categoryCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse(null);

        List<Event> recommendations = allEvents.stream()
                .filter(e -> e.getCategory() != null && e.getCategory().getId().equals(topCategoryId))
                .limit(3)
                .toList();
        
        if (recommendations.isEmpty()) {
            recommendations = allEvents.stream().limit(3).toList();
        }

        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/admin/venues/{id}/layout")
    public ResponseEntity<?> saveVenueLayout(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Venue venue = venueService.getAllVenues().stream()
            .filter(v -> v.getId().equals(id))
            .findFirst().orElse(null);
            
        if (venue == null) return ResponseEntity.notFound().build();
        
        venue.setLayoutData(payload.get("layoutData"));
        venueService.saveVenue(venue);
        
        return ResponseEntity.ok(Map.of("message", "Layout saved successfully", "venue", venue));
    }

    @PostMapping("/waitlist")
    public ResponseEntity<?> joinWaitlist(@RequestBody Map<String, Long> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(auth.getName());
        if (user == null) return ResponseEntity.status(401).build();

        Long eventId = payload.get("eventId");
        Event event = eventService.getEventById(eventId).orElse(null);
        if (event == null) return ResponseEntity.status(404).body("Event not found");

        Waitlist waitlist = new Waitlist();
        waitlist.setUser(user);
        waitlist.setEvent(event);
        waitlist.setJoinedAt(java.time.LocalDateTime.now());
        waitlist.setNotified(false);
        waitlistRepository.save(waitlist);

        return ResponseEntity.ok(Map.of("message", "Successfully joined the waitlist!"));
    }
}
