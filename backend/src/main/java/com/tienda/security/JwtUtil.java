package com.tienda.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long EXPIRATION_MS = 28800000; // 1 día en milisegundos

    public String generateToken(String email, String rol, Long tiendaId) {
        return Jwts.builder()
            .setSubject(email)
            .claim("rol", rol) // puedes agregar más datos
            .claim("tiendaId", tiendaId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .signWith(key)
            .compact();
        }
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
             .setSigningKey(key)
             .build()
             .parseClaimsJws(token)
             .getBody()
             .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
             Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
          return false;
          }
    }
    
}
