package com.tienda;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PruebaPassword {
	public static void main(String[] args) {
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		String contraseñaIngresada = "1234";
		String contraseñaGuardada = "$2a$10$sJ95SwF6UQqeFMHQE9IM0.NfWN.7vGwHmNiBGg6vRyMgTw5lTCQ8e";
								 
		boolean esValida = passwordEncoder.matches(contraseñaIngresada, contraseñaGuardada);

		System.out.println("¿Coincide? " + esValida);
	}
}
