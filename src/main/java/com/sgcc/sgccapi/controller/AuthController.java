package com.sgcc.sgccapi.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgcc.sgccapi.dto.LoginResponseDTO;
import com.sgcc.sgccapi.dto.PermisosPorRolDTO;
import com.sgcc.sgccapi.dto.PersonaDTO;
import com.sgcc.sgccapi.dto.UsuarioLoginDTO;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Usuario;
import com.sgcc.sgccapi.service.IInquilinoService;
import com.sgcc.sgccapi.service.IPermisoService;
import com.sgcc.sgccapi.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.*;

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
    private final IInquilinoService inquilinoService;

    private final IPermisoService permisoService;

    public AuthController(IUsuarioService usuarioService,
                          IInquilinoService inquilinoService,
                          IPermisoService permisoService) {
        this.usuarioService = usuarioService;
        this.inquilinoService = inquilinoService;
        this.permisoService = permisoService;
    }

    @GetMapping("/additional-info/{usuario}")
    public ResponseEntity<?> obtenerDatosAdicionalesAfterLogin(@PathVariable String usuario) throws Exception {
        Usuario usuarioFound = usuarioService.getUsuarioByUsuario(usuario)
                .orElseThrow(() -> new Exception("El usuario no existe."));

        List<PermisosPorRolDTO> permisosFound = permisoService
                .spObtenerPermisosPorRol(usuarioFound.getRol().getIdRol());

        if (permisosFound.isEmpty()) {
            throw new Exception("El usuario no tiene permisos.");
        }

        LoginResponseDTO responseDTO = new LoginResponseDTO();

        LoginResponseDTO.LoginDetails loginDetails = new LoginResponseDTO.LoginDetails();

        LoginResponseDTO.LoginUser loginUser = new LoginResponseDTO.LoginUser();
        LoginResponseDTO.LoginPersona loginPersona = new LoginResponseDTO.LoginPersona();
        List<LoginResponseDTO.LoginPermisos> loginPermisos = new ArrayList<>();
        LoginResponseDTO.LoginSesion loginSesion = new LoginResponseDTO.LoginSesion();

        loginSesion.setEstado("ACT");

        loginPersona.setNombre(usuarioFound.getPersona().getNombres());
        loginPersona.setApellidoPaterno(usuarioFound.getPersona().getApellidoPaterno());
        loginPersona.setApellidoMaterno(usuarioFound.getPersona().getApellidoMaterno());
        loginPersona.setNroDocumento(usuarioFound.getPersona().getNroDocumento());
        loginPersona.setGenero(usuarioFound.getPersona().getGenero());
        loginPersona.setDireccion(usuarioFound.getPersona().getDireccion());
        loginPersona.setTelefono(usuarioFound.getPersona().getTelefono());
        loginPersona.setEmail(usuarioFound.getPersona().getEmail());

        loginUser.setUsuario(usuarioFound.getUsuario());
        loginUser.setPassword(usuarioFound.getPassword());
        loginUser.setFoto(null);

        loginUser.setPersona(loginPersona);

        permisosFound.forEach(p -> loginPermisos.add(new LoginResponseDTO.LoginPermisos(p.getIdComponente(),
                    p.getIdComponentePadre(), p.getIdPermiso(), p.getComponente(), p.getIcono(), p.getRuta(),
                    Integer.parseInt(p.getOrden()), p.getEstado())));

        loginDetails.setRuta(usuarioFound.getRol().getRuta());
        loginDetails.setToken(null);
        loginDetails.setRefreshToken(null);
        loginDetails.setUser(loginUser);
        loginDetails.setSesion(loginSesion);
        loginDetails.setPermisos(loginPermisos);

        responseDTO.setMessage("Inicio de sesión correcto.");
        responseDTO.setDetails(loginDetails);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/profile/{usuario}")
    public ResponseEntity<?> obtenerDatosPerfil(@PathVariable String usuario) throws Exception {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioFound = usuarioService.getUsuarioByUsuario(usuario)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe."));
        Long idInquilino = null;
        if (usuarioFound.getRol().getRol().equals(INQUILINO_ROLE)) {
            Inquilino inquilinoFound = inquilinoService
                    .getInquilinoByIdPersona(usuarioFound.getPersona().getIdPersona())
                    .orElseThrow(() -> new Exception("El inquilino no existe."));
            idInquilino = inquilinoFound.getIdInquilino();
        }
        PersonaDTO personaDTO = new PersonaDTO(usuarioFound.getPersona().getIdPersona(),
                usuarioFound.getPersona().getNombres(), usuarioFound.getPersona().getApellidoPaterno(),
                usuarioFound.getPersona().getApellidoMaterno(), usuarioFound.getPersona().getTipoDocumento(),
                usuarioFound.getPersona().getNroDocumento(), usuarioFound.getPersona().getGenero(),
                usuarioFound.getPersona().getDireccion(), usuarioFound.getPersona().getTelefono(),
                usuarioFound.getPersona().getEmail());
        UsuarioLoginDTO usuarioLoginDTO = new UsuarioLoginDTO(usuarioFound.getIdUsuario(), idInquilino,
                usuarioFound.getUsuario(), /* usuarioFound.getFoto(), */ personaDTO, usuarioFound.getEstado());
        response.put("usuario", usuarioLoginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader(AUTHORIZATION);
        System.out.println("refresh authHeader = " + authHeader);
        if (authHeader != null && authHeader.startsWith(BEARER_AUTHENTICATION)) {
            try {
                String refreshToken = authHeader.substring(BEARER_AUTHENTICATION.length());
                System.out.println("refreshToken = " + refreshToken);
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
                String newRefreshToken = JWT.create()
                        .withSubject(usuarioFound.getUsuario())
                        .withExpiresAt(setExpirationRefreshTokenTime())
                        .withIssuer(request.getRequestURI())
                        .sign(algorithm);
                Map<String, String> map = new HashMap<>();
                map.put("accessToken", accessToken);
                map.put("refreshToken", newRefreshToken);
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

    private Date setExpirationRefreshTokenTime() {
        return Date.from(Instant.ofEpochMilli(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME));
    }
}
