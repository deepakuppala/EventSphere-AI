package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(String status);

    List<Event> findByOrganizer(String organizer);

    List<Event> findByEventNameContainingIgnoreCase(String keyword);

}