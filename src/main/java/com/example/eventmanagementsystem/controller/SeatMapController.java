package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SeatMapController {

    @Autowired
    private EventRepository eventRepository;

    @MessageMapping("/seatmap.update/{eventId}")
    @SendTo("/topic/seatmap/{eventId}")
    public Map<String, Object> updateSeatMap(@DestinationVariable Long eventId, Map<String, Object> payload) {
        // Save state to DB
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null) {
            // In a real app we'd merge seat states, here we just broadcast the selected seat
            // and the frontend handles the merging
        }
        return payload; // Broadcast to all subscribers
    }
}
