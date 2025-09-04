package com.recyclanka.waste_management.utill;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.secretKey}")
    private String secretKey;
    public String generateToken(String email) {//Generate JWT token with email
        // This is a placeholder for JWT generation logic.
        // In a real application, you would use a library like jjwt or java-jwt to create a JWT.
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(
                        System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes())
                ,SignatureAlgorithm.HS256).compact();
    }

    public String extractEmail(String token) {//email eka ganna hadanne
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {//Check if the token is valid
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
