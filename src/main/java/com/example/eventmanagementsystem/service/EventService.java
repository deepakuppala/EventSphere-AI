package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Save Event
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    // Get All Events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get Event By ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // Update Event
    public Event updateEvent(Long id, Event eventDetails) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setEventName(eventDetails.getEventName());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventTime(eventDetails.getEventTime());
        event.setTicketPrice(eventDetails.getTicketPrice());
        event.setTotalSeats(eventDetails.getTotalSeats());
        event.setAvailableSeats(eventDetails.getAvailableSeats());
        event.setOrganizer(eventDetails.getOrganizer());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setStatus(eventDetails.getStatus());
        event.setCategory(eventDetails.getCategory());
        event.setVenue(eventDetails.getVenue());

        return eventRepository.save(event);
    }

    // Delete Event
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // Search Events
    public List<Event> searchEvents(String keyword) {
        return eventRepository.findByEventNameContainingIgnoreCase(keyword);
    }

    // Upcoming Events
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStatus("Upcoming");
    }

    // Organizer Events
    public List<Event> getOrganizerEvents(String organizer) {
        return eventRepository.findByOrganizer(organizer);
    }
}