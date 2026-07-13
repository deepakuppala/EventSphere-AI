package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Ticket;
import com.example.eventmanagementsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket generateTicket(Ticket ticket) {

        ticket.setTicketNumber("EVT-" +
                UUID.randomUUID().toString().substring(0,8).toUpperCase());

        ticket.setQrCode("Generated Later");

        ticket.setTicketStatus("ACTIVE");

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicket(String ticketNumber) {
        return ticketRepository.findByTicketNumber(ticketNumber);
    }
}