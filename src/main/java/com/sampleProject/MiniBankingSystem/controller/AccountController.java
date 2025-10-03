package com.sampleProject.MiniBankingSystem.controller;

import com.sampleProject.MiniBankingSystem.dto.AccountDtos;
import com.sampleProject.MiniBankingSystem.model.Account;
import com.sampleProject.MiniBankingSystem.model.BankTransaction;
import com.sampleProject.MiniBankingSystem.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/accounts","/api/v1/accounts"})
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountDtos.AccountResponse create(@RequestBody @Valid AccountDtos.CreateAccountRequest req) {
        return toDto(accountService.createAccount(req));
    }

    @GetMapping("/{id}")
    public AccountDtos.AccountResponse get(@PathVariable Long id) {
        return toDto(accountService.getAccount(id));
    }

    @PostMapping("/{id}/deposit")
    public AccountDtos.AccountResponse deposit(@PathVariable Long id, @RequestBody @Valid AccountDtos.MoneyRequest req) {
        return toDto(accountService.deposit(id, req.amount, req.note));
    }

    @PostMapping("/{id}/withdraw")
    public AccountDtos.AccountResponse withdraw(@PathVariable Long id, @RequestBody @Valid AccountDtos.MoneyRequest req) {
        return toDto(accountService.withdraw(id, req.amount, req.note));
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@RequestBody @Valid AccountDtos.TransferRequest req) {
        accountService.transfer(req.fromAccountId, req.toAccountId, req.amount, req.note);
    }

    @GetMapping("/{id}/transactions")
    public List<BankTransaction> transactions(@PathVariable Long id) {
        return accountService.listTransactions(id);
    }

    @GetMapping("/by-customer/{customerId}")
    public List<AccountDtos.AccountResponse> byCustomer(@PathVariable Long customerId){
        return accountService.listAccountsForCustomer(customerId).stream().map(AccountController::toDto).collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){
        accountService.deleteAccount(id);
    }

    @PostMapping("/{id}/close")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void close(@PathVariable Long id){
        accountService.deleteAccount(id);
    }

    private static AccountDtos.AccountResponse toDto(Account a) {
        AccountDtos.AccountResponse dto = new AccountDtos.AccountResponse();
        dto.id = a.getId();
        dto.accountNumber = a.getAccountNumber();
        dto.customerId = a.getCustomer() != null ? a.getCustomer().getId() : null;
        dto.accountType = a.getAccountType();
        dto.balance = a.getBalance();
        dto.openedAt = a.getOpenedAt();
        dto.interestRate = a.getInterestRate();
        dto.overdraftLimit = a.getOverdraftLimit();
        dto.status = a.getStatus();
        return dto;
    }
}
