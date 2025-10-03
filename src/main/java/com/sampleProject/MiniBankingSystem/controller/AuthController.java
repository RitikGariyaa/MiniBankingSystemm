package com.sampleProject.MiniBankingSystem.controller;

import com.sampleProject.MiniBankingSystem.dto.CustomerDtos;
import com.sampleProject.MiniBankingSystem.model.Customer;
import com.sampleProject.MiniBankingSystem.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

    private CustomerDtos.CustomerResponse toDto(Customer c){
        CustomerDtos.CustomerResponse d = new CustomerDtos.CustomerResponse();
        d.setId(c.getId());
        d.setFirstName(c.getFirstName());
        d.setLastName(c.getLastName());
        d.setEmail(c.getEmail());
        d.setPhone(c.getPhone());
        d.setDob(c.getDob());
        d.setCreatedAt(c.getCreatedAt());
        return d;
    }

    /**
     * Simple login with email + password (stored in plain text for demo only!)
     */
    @PostMapping("/login")
    public ResponseEntity<CustomerDtos.CustomerResponse> login(@RequestBody @Valid CustomerDtos.LoginRequest req){
        Customer c = customerService.findByEmail(req.getEmail());
        if (!c.getPassword().equals(req.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return ResponseEntity.ok(toDto(c));
    }

    /**
     * No-op logout kept for compatibility.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(){
        return ResponseEntity.noContent().build();
    }
}
