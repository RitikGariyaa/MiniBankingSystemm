package com.sampleProject.MiniBankingSystem.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.Instant
import java.time.LocalDate

class CustomerDtos {
    class CreateCustomerRequest {
        @NotBlank(message = "First name is required")
        @Size(max = 100)
        var firstName: String? = null
        @Size(max = 100)
        var lastName: String? = null
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 255)
        var email: String? = null
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
        var phone: String? = null
        var dob: LocalDate? = null
        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 100, message = "Password must be 6-100 characters")
        var password: String? = null
    }

    class CustomerResponse {
        var id: Long? = null
        var firstName: String? = null
        var lastName: String? = null
        var email: String? = null
        var phone: String? = null
        var dob: LocalDate? = null
        var createdAt: Instant? = null
        var addressLine1: String? = null
        var addressLine2: String? = null
        var city: String? = null
        var state: String? = null
        var postalCode: String? = null
        var country: String? = null
    }

    class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email
        var email: String? = null
        @NotBlank(message = "Password is required")
        var password: String? = null
    }

    class AuthResponse {
        var token: String? = null
        var customer: CustomerResponse? = null
    }

    class UpdateCustomerRequest {
        @jakarta.validation.constraints.Size(max = 100)
        var firstName: String? = null
        @jakarta.validation.constraints.Size(max = 100)
        var lastName: String? = null
        @jakarta.validation.constraints.Email(message = "Invalid email format")
        var email: String? = null
        @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
        var phone: String? = null
        @jakarta.validation.constraints.Size(max = 255)
        var addressLine1: String? = null
        @jakarta.validation.constraints.Size(max = 255)
        var addressLine2: String? = null
        @jakarta.validation.constraints.Size(max = 100)
        var city: String? = null
        @jakarta.validation.constraints.Size(max = 100)
        var state: String? = null
        @jakarta.validation.constraints.Size(max = 20)
        var postalCode: String? = null
        @jakarta.validation.constraints.Size(max = 100)
        var country: String? = null
        var dob: java.time.LocalDate? = null
    }
}
