package com.example.eventmanagementsystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;

    @Column(length = 2000)
    private String description;

    private LocalDate eventDate;

    private LocalTime eventTime;

    private Double ticketPrice;

    private Integer totalSeats;

    private Integer availableSeats;

    private String organizer;

    private String imageUrl;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String seatMapState; // JSON representing the live seat map

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    public Event() {
    }

    public Event(Long id, String eventName, String description,
                 LocalDate eventDate, LocalTime eventTime,
                 Double ticketPrice, Integer totalSeats,
                 Integer availableSeats, String organizer,
                 String imageUrl, String status, String seatMapState,
                 Category category, Venue venue) {

        this.id = id;
        this.eventName = eventName;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.ticketPrice = ticketPrice;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.organizer = organizer;
        this.imageUrl = imageUrl;
        this.status = status;
        this.seatMapState = seatMapState;
        this.category = category;
        this.venue = venue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeatMapState() {
        return seatMapState;
    }

    public void setSeatMapState(String seatMapState) {
        this.seatMapState = seatMapState;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }
}