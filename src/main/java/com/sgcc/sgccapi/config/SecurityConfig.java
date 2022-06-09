package com.sgcc.sgccapi.config;

import com.sgcc.sgccapi.filter.CustomAuthenticationFilter;
import com.sgcc.sgccapi.filter.CustomAuthorizationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.sgcc.sgccapi.constant.SecurityConstants.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;

    @Value("${jwt.custom-secret}")
    protected String secret;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomAuthenticationFilter customAuthFilter = new CustomAuthenticationFilter(authenticationManagerBean(),
                secret);
        customAuthFilter.setFilterProcessesUrl(LOGIN_PATH);
        http
                .csrf().disable()
                .cors()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests().antMatchers(LOGIN_PATH, TOKEN_REFRESH_PATH).permitAll()
                .and()
                .authorizeRequests().antMatchers(AUTH_PATH_REGEX,
                        "/api/mantenimiento/inquilinos/profile/**", "/api/mantenimiento/usuarios/profile/**").hasAnyAuthority(ADMIN_ROLE,
                        INQUILINO_ROLE)
                .and()
                .authorizeRequests().antMatchers(MANTENIMIENTO_PATH_REGEX).hasAuthority(ADMIN_ROLE)
                .and()
                .authorizeRequests().antMatchers(SEGURIDAD_PATH_REGEX).hasAuthority(ADMIN_ROLE)
                .and()
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .addFilter(customAuthFilter)
                .addFilterBefore(new CustomAuthorizationFilter(secret), UsernamePasswordAuthenticationFilter.class);
    }
}
