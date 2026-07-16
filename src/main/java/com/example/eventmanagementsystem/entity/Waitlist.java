package com.example.eventmanagementsystem.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waitlists")
public class Waitlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    private LocalDateTime joinedAt;

    private Boolean notified;

    public Waitlist() {
        this.joinedAt = LocalDateTime.now();
        this.notified = false;
    }

    public Waitlist(User user, Event event) {
        this.user = user;
        this.event = event;
        this.joinedAt = LocalDateTime.now();
        this.notified = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public Boolean getNotified() { return notified; }
    public void setNotified(Boolean notified) { this.notified = notified; }
}
