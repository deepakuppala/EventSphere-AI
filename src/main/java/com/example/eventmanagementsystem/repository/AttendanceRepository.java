package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

}