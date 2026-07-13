package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {

    Venue findByVenueName(String venueName);

}