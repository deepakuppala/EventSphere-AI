package com.example.eventmanagementsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWaitlistNotification(String toEmail, String eventName, String eventUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("A ticket opened up for " + eventName + "!");
        message.setText("Great news! A ticket just became available for " + eventName + ".\n\n" +
                "Click the link below to claim it before someone else does:\n" +
                eventUrl + "\n\n" +
                "Best regards,\nEventSphere Team");

        try {
            mailSender.send(message);
            System.out.println("Waitlist email sent to " + toEmail);
        } catch (Exception e) {
            // For dev purposes, if mailtrap isn't configured correctly, just log it.
            System.err.println("Failed to send email to " + toEmail + ". " + e.getMessage());
            System.out.println("[MOCK EMAIL] To: " + toEmail + " | Subject: A ticket opened up for " + eventName + "!");
        }
    }
}
