package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Booking;
import com.example.eventmanagementsystem.entity.Payment;
import com.example.eventmanagementsystem.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Save Payment
    public Payment makePayment(Payment payment){

        payment.setPaymentDate(LocalDateTime.now());

        payment.setPaymentStatus("SUCCESS");

        payment.setTransactionId(
                UUID.randomUUID().toString().substring(0,12).toUpperCase());

        return paymentRepository.save(payment);
    }

    // Get All Payments
    public List<Payment> getAllPayments(){

        return paymentRepository.findAll();

    }
    public Payment getPaymentByBooking(Booking booking){

        return paymentRepository.findByBooking(booking);

    }
    // Total Revenue
    public Double getTotalRevenue(){

        return paymentRepository.findAll()
                .stream()
                .mapToDouble(Payment::getAmount)
                .sum();

    }

}