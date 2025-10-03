package com.sampleProject.MiniBankingSystem.service;

import com.sampleProject.MiniBankingSystem.dto.CustomerDtos;
import com.sampleProject.MiniBankingSystem.model.Customer;
import com.sampleProject.MiniBankingSystem.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer createCustomer(CustomerDtos.CreateCustomerRequest req) {
        if (req.getEmail() == null) {
            throw new IllegalArgumentException("Email required");
        }
        if (req.getDob() == null) {
            throw new IllegalArgumentException("Date of birth required");
        }
        // Age validation
        LocalDate today = LocalDate.now();
        Period age = Period.between(req.getDob(), today);
        if (age.getYears() < 18) {
            throw new IllegalArgumentException("Customer must be at least 18 years old");
        }
        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password required");
        }
        customerRepository.findByEmail(req.getEmail()).ifPresent(c -> {
            throw new IllegalArgumentException("Email already registered");
        });
        Customer c = new Customer();
        c.setFirstName(req.getFirstName());
        c.setLastName(req.getLastName());
        c.setEmail(req.getEmail());
        c.setPhone(req.getPhone());
        c.setDob(req.getDob());
        c.setPassword(req.getPassword()); // NOTE: Plain text for demo only.
        return customerRepository.save(c);
    }

    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
    }

    public Customer findByEmail(String email) {
        return customerRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Customer not found: " + email));
    }

    @Transactional
    public Customer updateCustomer(Long id, CustomerDtos.UpdateCustomerRequest req) {
        Customer c = getCustomer(id);
        // allow first/last name updates if provided (non-empty)
        if (req.getFirstName() != null && !req.getFirstName().isBlank()) {
            c.setFirstName(req.getFirstName().trim());
        }
        if (req.getLastName() != null) {
            c.setLastName(req.getLastName() == null ? null : req.getLastName().trim());
        }
        if (req.getEmail() != null && !req.getEmail().equalsIgnoreCase(c.getEmail())) {
            customerRepository.findByEmail(req.getEmail()).ifPresent(existing -> {
                throw new IllegalArgumentException("Email already registered");
            });
            c.setEmail(req.getEmail());
        }
        if (req.getPhone() != null) {
            if (!req.getPhone().matches("\\d{10}")) {
                throw new IllegalArgumentException("Phone must be exactly 10 digits");
            }
            c.setPhone(req.getPhone());
        }
        if (req.getAddressLine1() != null) c.setAddressLine1(req.getAddressLine1());
        if (req.getAddressLine2() != null) c.setAddressLine2(req.getAddressLine2());
        if (req.getCity() != null) c.setCity(req.getCity());
        if (req.getState() != null) c.setState(req.getState());
        if (req.getPostalCode() != null) c.setPostalCode(req.getPostalCode());
        if (req.getCountry() != null) c.setCountry(req.getCountry());
        if (req.getDob() != null) {
            LocalDate today = LocalDate.now();
            Period age = Period.between(req.getDob(), today);
            if (age.getYears() < 18) {
                throw new IllegalArgumentException("Customer must be at least 18 years old");
            }
            c.setDob(req.getDob());
        }
        return customerRepository.save(c);
    }
}
