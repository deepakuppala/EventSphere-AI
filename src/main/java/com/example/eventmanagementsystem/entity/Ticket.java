package com.example.eventmanagementsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(unique = true)
    private String ticketNumber;

    private String qrCode;

    private String ticketStatus;

    public Ticket() {
    }

    public Ticket(Long ticketId, Booking booking, String ticketNumber,
                  String qrCode, String ticketStatus) {
        this.ticketId = ticketId;
        this.booking = booking;
        this.ticketNumber = ticketNumber;
        this.qrCode = qrCode;
        this.ticketStatus = ticketStatus;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }
}