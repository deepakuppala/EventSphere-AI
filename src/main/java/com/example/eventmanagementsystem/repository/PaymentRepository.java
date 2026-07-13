package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByBooking(Booking booking);

}