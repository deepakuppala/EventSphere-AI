package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Venue;
import com.example.eventmanagementsystem.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    // Save Venue
    public Venue saveVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    // Get All Venues
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    // Get Venue By Id
    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id);
    }

    // Update Venue
    public Venue updateVenue(Long id, Venue venueDetails) {

        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        venue.setVenueName(venueDetails.getVenueName());
        venue.setAddress(venueDetails.getAddress());
        venue.setCity(venueDetails.getCity());
        venue.setState(venueDetails.getState());
        venue.setCapacity(venueDetails.getCapacity());
        venue.setContactNumber(venueDetails.getContactNumber());

        return venueRepository.save(venue);
    }

    // Delete Venue
    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }

    // Search Venue
    public Venue findByVenueName(String venueName) {
        return venueRepository.findByVenueName(venueName);
    }
}