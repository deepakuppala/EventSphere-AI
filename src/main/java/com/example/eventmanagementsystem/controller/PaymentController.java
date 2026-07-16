package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.repository.EventRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PaymentController {

    @Value("${stripe.apiKey}")
    private String stripeApiKey;

    @Autowired
    private EventRepository eventRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    private boolean isMockKey() {
        return stripeApiKey == null || stripeApiKey.contains("Mock") || stripeApiKey.length() < 30;
    }

    @PostMapping("/create-checkout-session")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> data) {
        try {
            Long eventId = Long.valueOf(data.get("eventId").toString());
            Integer quantity = Integer.valueOf(data.get("quantity").toString());

            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            Map<String, String> responseData = new HashMap<>();

            // If no real Stripe key, simulate a successful payment redirect
            if (isMockKey()) {
                String mockSuccessUrl = "http://localhost:5173/payment-success?session_id=mock_session_" + System.currentTimeMillis()
                        + "&eventId=" + eventId + "&quantity=" + quantity;
                responseData.put("id", "mock_session");
                responseData.put("url", mockSuccessUrl);
                System.out.println("[MOCK STRIPE] Simulating checkout for event: " + event.getEventName() + ", qty: " + quantity);
                return ResponseEntity.ok(responseData);
            }

            // Real Stripe call
            long amountInPaise = (long) (event.getTicketPrice() * 100);

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&eventId=" + eventId + "&quantity=" + quantity)
                    .setCancelUrl("http://localhost:5173/booking/" + eventId)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity((long) quantity)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("inr")
                                                    .setUnitAmount(amountInPaise)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(event.getEventName() + " Ticket")
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            responseData.put("id", session.getId());
            responseData.put("url", session.getUrl());
            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
