package com.sgcc.sgccapi.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgcc.sgccapi.dto.PersonaDTO;
import com.sgcc.sgccapi.dto.UsuarioLoginDTO;
import com.sgcc.sgccapi.model.Usuario;
import com.sgcc.sgccapi.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.sgcc.sgccapi.constant.SecurityConstants.*;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(AUTH_PATH)
public class AuthController {

    @Value("${jwt.custom-secret}")
    private String SECRET;
    private final IUsuarioService usuarioService;

    public AuthController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/profile/{usuario}")
    public ResponseEntity<?> obtenerDatosPerfil(@PathVariable String usuario) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioFound = usuarioService.getUsuarioByUsuario(usuario)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe."));
        PersonaDTO personaDTO = new PersonaDTO(usuarioFound.getPersona().getNombres(),
                usuarioFound.getPersona().getApellidoPaterno(), usuarioFound.getPersona().getApellidoMaterno(),
                usuarioFound.getPersona().getNroDocumento(), usuarioFound.getPersona().getGenero(),
                usuarioFound.getPersona().getDireccion(), usuarioFound.getPersona().getTelefono(),
                usuarioFound.getPersona().getEmail());
        UsuarioLoginDTO usuarioLoginDTO = new UsuarioLoginDTO(usuarioFound.getUsuario(),
                usuarioFound.getFoto(), personaDTO);
        response.put("usuario", usuarioLoginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith(BEARER_AUTHENTICATION)) {
            try {
                String refreshToken = authHeader.substring(BEARER_AUTHENTICATION.length());
                Algorithm algorithm = Algorithm.HMAC256(SECRET.getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refreshToken);
                String usuario = decodedJWT.getSubject();
                Usuario usuarioFound = usuarioService.getUsuarioByUsuario(usuario)
                        .orElseThrow(() -> new Exception("El usuario no existe."));
                String accessToken = JWT.create()
                        .withSubject(usuarioFound.getUsuario())
                        .withExpiresAt(setExpirationTokenTime())
                        .withIssuer(request.getRequestURI())
                        .withClaim(ROLES_CLAIMS_NAME, List.of(usuarioFound.getRol().getRol()))
                        .sign(algorithm);
                Map<String, String> map = new HashMap<>();
                map.put("accessToken", accessToken);
                map.put("refreshToken", refreshToken);
                map.put("usuario", usuarioFound.getUsuario());
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), map);
            } catch (Exception ex) {
                Map<String, String> map = new HashMap<>();
                map.put("message", "Token inválido o caducado.");
                response.setHeader("error", ex.getMessage());
                response.setContentType(APPLICATION_JSON_VALUE);
                response.setStatus(FORBIDDEN.value());
                new ObjectMapper().writeValue(response.getOutputStream(), map);
            }
        } else {
            throw new RuntimeException("Token no válido.");
        }
    }

    private Date setExpirationTokenTime() {
        return Date.from(Instant.ofEpochMilli(System.currentTimeMillis() + TOKEN_EXPIRATION_TIME));
    }
}
