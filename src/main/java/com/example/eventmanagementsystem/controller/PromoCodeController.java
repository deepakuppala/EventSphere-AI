package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.PromoCode;
import com.example.eventmanagementsystem.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/promo")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class PromoCodeController {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    @PostMapping("/validate")
    public ResponseEntity<?> validateCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        Map<String, Object> response = new HashMap<>();

        PromoCode promo = promoCodeRepository.findByCodeIgnoreCase(code).orElse(null);

        if (promo == null || !promo.getActive()) {
            response.put("valid", false);
            response.put("message", "Invalid promo code.");
            return ResponseEntity.ok(response);
        }
        if (promo.getExpiresAt() != null && promo.getExpiresAt().isBefore(LocalDateTime.now())) {
            response.put("valid", false);
            response.put("message", "This promo code has expired.");
            return ResponseEntity.ok(response);
        }
        if (promo.getUsageLimit() != null && promo.getUsedCount() >= promo.getUsageLimit()) {
            response.put("valid", false);
            response.put("message", "This promo code has reached its usage limit.");
            return ResponseEntity.ok(response);
        }

        response.put("valid", true);
        response.put("discountPercent", promo.getDiscountPercent());
        response.put("message", promo.getDiscountPercent() + "% discount applied!");
        return ResponseEntity.ok(response);
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllCodes() {
        return ResponseEntity.ok(promoCodeRepository.findAll());
    }

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @PostMapping("/admin/create")
    public ResponseEntity<?> createCode(@RequestBody PromoCode promoCode) {
        PromoCode saved = promoCodeRepository.save(promoCode);
        
        Map<String, String> toast = new HashMap<>();
        toast.put("title", "New Promo Code! \uD83C\uDF89");
        toast.put("message", "Use code " + saved.getCode() + " for " + saved.getDiscountPercent() + "% off!");
        toast.put("type", "success");
        messagingTemplate.convertAndSend("/topic/global", toast);
        
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteCode(@PathVariable Long id) {
        promoCodeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
