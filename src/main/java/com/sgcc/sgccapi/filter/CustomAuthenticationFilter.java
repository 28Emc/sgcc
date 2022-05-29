package com.sgcc.sgccapi.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgcc.sgccapi.service.IUsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired
    private IUsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;

    long TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 HORA
    long REFRESH_TOKEN_EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12 HORAS

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        String usuario = request.getParameter("usuario");
        String password = request.getParameter("password");
        log.info("Usuario autenticado: " + usuario + ", password: " + password);
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(usuario, password));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
        //@Value("${jwt.custom-secret:sgcc_jwt_secret}") // FIXME: NO SE INYECTA CORRECTAMENTE.
        String SECRET = "sgcc_jwt_secret";
        Algorithm algorithm = Algorithm.HMAC256(SECRET.getBytes());
        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(setExpirationTokenTime(TOKEN_EXPIRATION_TIME))
                .withIssuer(request.getRequestURI())
                .withClaim("roles", user.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(setExpirationTokenTime(REFRESH_TOKEN_EXPIRATION_TIME))
                .withIssuer(request.getRequestURI())
                .sign(algorithm);
        Map<String, String> map = new HashMap<>();
        map.put("accessToken", accessToken);
        map.put("refreshToken", refreshToken);
        map.put("usuario", user.getUsername());
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(OK.value());
        log.info("Response successful login: " + map);
        new ObjectMapper().writeValue(response.getOutputStream(), map);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        String usuario = request.getParameter("usuario");
        String password = request.getParameter("password");
        Map<String, String> map = new HashMap<>();
        map.put("message", "Usuario y/o contraseña incorrectos.");
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(FORBIDDEN.value());
        log.info("Usuario error login: " + usuario + ", password: " + password);
        new ObjectMapper().writeValue(response.getOutputStream(), map);
    }

    private Date setExpirationTokenTime(long expirationTime) {
        return Date.from(Instant.ofEpochMilli(System.currentTimeMillis() + expirationTime));
    }
}
