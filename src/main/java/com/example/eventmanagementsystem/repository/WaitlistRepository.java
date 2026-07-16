package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Event;
import com.example.eventmanagementsystem.entity.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findByEventAndNotifiedFalseOrderByJoinedAtAsc(Event event);
}
