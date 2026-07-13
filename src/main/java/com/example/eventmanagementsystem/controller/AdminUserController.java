package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/users")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public String users(Model model){

        model.addAttribute("users", userService.getAllUsers());

        return "admin-users";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id){

        userService.deleteUser(id);

        return "redirect:/admin/users";
    }

}