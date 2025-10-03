package com.sampleProject.MiniBankingSystem.repository;

import com.sampleProject.MiniBankingSystem.model.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {
    List<BankTransaction> findByAccount_IdOrderByTxnDateDesc(Long accountId);
}
