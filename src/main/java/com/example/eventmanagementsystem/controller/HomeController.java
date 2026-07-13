package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.User;
import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.eventmanagementsystem.service.EventService;
import com.example.eventmanagementsystem.entity.Event;
import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {

    @Autowired
    UserService userService;

    @GetMapping("/")
    public String home(Model model) {

        model.addAttribute("events", eventService.getAllEvents());

        return "index";
    }

    @Autowired
    private EventService eventService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @GetMapping("/booking/{id}")
    public String booking(@PathVariable Long id, Model model) {

        Event event = eventService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event Not Found"));

        model.addAttribute("event", event);

        return "booking";
    }

    @GetMapping("/events")
    public String events(Model model) {

        model.addAttribute("events", eventService.getAllEvents());

        return "events";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/ticket")
    public String ticketPage() {
        return "ticket";
    }

    @PostMapping("/register")
    public String register(User user){

        userService.saveUser(user);

        return "redirect:/login";

    }

    @PostMapping("/login")
    public String login(User user,
                        Model model,
                        HttpSession session){

        User existingUser =
                userService.login(user.getEmail(), user.getPassword());

        if(existingUser != null){

            session.setAttribute("loggedUser", existingUser);

            return "redirect:/dashboard";

        }

        model.addAttribute("error","Invalid Email or Password");

        return "login";
    }
}