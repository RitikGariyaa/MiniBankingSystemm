package com.sampleProject.MiniBankingSystem.service;

import com.sampleProject.MiniBankingSystem.model.Account;
import com.sampleProject.MiniBankingSystem.model.BankTransaction;
import com.sampleProject.MiniBankingSystem.repository.BankTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {
    private final BankTransactionRepository transactionRepository;

    public TransactionService(BankTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public BankTransaction record(Account account, BigDecimal amount, String type, String note) {
        BankTransaction txn = new BankTransaction();
        txn.setAccount(account);
        txn.setAmount(amount);
        txn.setTxnType(type);
        txn.setNote(note);
        return transactionRepository.save(txn);
    }

    public List<com.sampleProject.MiniBankingSystem.model.BankTransaction> list(Long accountId) {
        return transactionRepository.findByAccount_IdOrderByTxnDateDesc(accountId);
    }
}

