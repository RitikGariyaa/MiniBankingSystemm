package com.sampleProject.MiniBankingSystem.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionTokenService {
    private static class Entry { long customerId; Instant createdAt; }
    private final Map<String, Entry> tokens = new ConcurrentHashMap<>();

    public String issueToken(long customerId) {
        String token = UUID.randomUUID().toString();
        Entry e = new Entry();
        e.customerId = customerId;
        e.createdAt = Instant.now();
        tokens.put(token, e);
        return token;
    }

    public Long resolve(String token) {
        if (token == null) return null;
        Entry e = tokens.get(token);
        return e == null ? null : e.customerId;
    }

    public void revoke(String token) { if (token != null) tokens.remove(token); }

    public int activeCount() { return tokens.size(); }
}

