package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Venue;
import com.example.eventmanagementsystem.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/venues")
@CrossOrigin(origins = "*")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @PostMapping("/save")
    public Venue saveVenue(@RequestBody Venue venue) {
        return venueService.saveVenue(venue);
    }

    @GetMapping("/all")
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    @GetMapping("/{id}")
    public Optional<Venue> getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id);
    }

    @PutMapping("/update/{id}")
    public Venue updateVenue(@PathVariable Long id,
                             @RequestBody Venue venue) {
        return venueService.updateVenue(id, venue);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return "Venue deleted successfully";
    }

    @GetMapping("/search/{name}")
    public Venue searchVenue(@PathVariable String name) {
        return venueService.findByVenueName(name);
    }
}