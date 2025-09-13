package com.tienda.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint; // Add this field

    @Autowired
    private JwtAccessDeniedHandler jwtAccessDeniedHandler; // Add this field

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        return http
            .csrf(csrf -> csrf.disable()) // Desactivar CSRF en APIs REST
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/*").permitAll()  // ← permite preflight
                .requestMatchers("/","/index.html","/src/**","/assets/**","/*.ico","/*.png","/*.jpg").permitAll()
                .requestMatchers("/auth/*","/error","usuarios/resetear-password").permitAll() // <-- Permitir login y registro sin autenticación
                .requestMatchers("/usuarios/estado","/cajas/*").hasRole("ADMIN")
                .requestMatchers("/movimientos/*","/tiendas/*").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.POST, "/cruce-addi/upload").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/cruce-Siste/upload").hasRole("ADMIN")
                .anyRequest().authenticated() // Todo lo demás requiere estar autenticado
                )
                .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint)   // 401 - No autenticado
                    .accessDeniedHandler(jwtAccessDeniedHandler)             // 403 - Acceso denegado
                )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
        }
    


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Other security configurations...

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**",configuration);

        return source;
    }

}
