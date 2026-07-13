package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.example.eventmanagementsystem.service.CategoryService;
import com.example.eventmanagementsystem.service.VenueService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.eventmanagementsystem.entity.Category;
import com.example.eventmanagementsystem.entity.Venue;

@Controller
@RequestMapping("/admin/events")
public class EventController {


    @Autowired
    private EventService eventService;
    @Autowired
    private CategoryService categoryService;


    @Autowired
    private VenueService venueService;

    @GetMapping
    public String viewEvents(Model model) {

        model.addAttribute("events", eventService.getAllEvents());

        return "admin-events";
    }
    @GetMapping("/edit/{id}")
    public String editEvent(@PathVariable Long id, Model model) {

        Event event = eventService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event Not Found"));

        model.addAttribute("event", event);

        model.addAttribute("categories", categoryService.getAllCategories());

        model.addAttribute("venues", venueService.getAllVenues());

        return "edit-event";
    }

    @PostMapping("/update")
    public String updateEvent(@ModelAttribute Event event) {

        eventService.saveEvent(event);

        return "redirect:/admin/events";
    }

    @GetMapping("/add")
    public String addEventPage(Model model) {

        Event event = new Event();

        event.setVenue(new Venue());
        event.setCategory(new Category());

        model.addAttribute("event", event);

        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("venues", venueService.getAllVenues());

        return "add-event";
    }
    @PostMapping("/save")
    public String saveEvent(@ModelAttribute Event event) {

        eventService.saveEvent(event);

        return "redirect:/admin/events";
    }

    @GetMapping("/delete/{id}")
    public String deleteEvent(@PathVariable Long id) {

        eventService.deleteEvent(id);

        return "redirect:/admin/events";
    }

}
