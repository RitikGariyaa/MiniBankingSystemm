package com.sampleProject.MiniBankingSystem.controller;

import com.sampleProject.MiniBankingSystem.dto.CustomerDtos;
import com.sampleProject.MiniBankingSystem.model.Customer;
import com.sampleProject.MiniBankingSystem.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/customers","/api/v1/customers"})
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDtos.CustomerResponse create(@RequestBody @Valid CustomerDtos.CreateCustomerRequest req) {
        Customer c = customerService.createCustomer(req);
        return toDto(c);
    }

    @GetMapping("/{id}")
    public CustomerDtos.CustomerResponse get(@PathVariable Long id) {
        return toDto(customerService.getCustomer(id));
    }

    @PatchMapping("/{id}")
    public CustomerDtos.CustomerResponse update(@PathVariable Long id, @RequestBody @Valid CustomerDtos.UpdateCustomerRequest req) {
        Customer updated = customerService.updateCustomer(id, req);
        return toDto(updated);
    }

    private static CustomerDtos.CustomerResponse toDto(Customer c) {
        CustomerDtos.CustomerResponse dto = new CustomerDtos.CustomerResponse();
        dto.setId(c.getId());
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setDob(c.getDob());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setAddressLine1(c.getAddressLine1());
        dto.setAddressLine2(c.getAddressLine2());
        dto.setCity(c.getCity());
        dto.setState(c.getState());
        dto.setPostalCode(c.getPostalCode());
        dto.setCountry(c.getCountry());
        return dto;
    }
}
