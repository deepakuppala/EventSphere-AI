package com.example.eventmanagementsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String venueName;

    private String address;

    private String city;

    private String state;

    private Integer capacity;

    private String contactNumber;

    public Venue() {
    }

    public Venue(Long id, String venueName, String address, String city,
                 String state, Integer capacity, String contactNumber) {
        this.id = id;
        this.venueName = venueName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.capacity = capacity;
        this.contactNumber = contactNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    @Column(columnDefinition = "TEXT")
    private String layoutData;

    public String getLayoutData() {
        return layoutData;
    }

    public void setLayoutData(String layoutData) {
        this.layoutData = layoutData;
    }
}