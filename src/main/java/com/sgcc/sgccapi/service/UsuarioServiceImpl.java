package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarPersonaDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearPersonaDTO;
import com.sgcc.sgccapi.model.Persona;
import com.sgcc.sgccapi.model.Rol;
import com.sgcc.sgccapi.model.Usuario;
import com.sgcc.sgccapi.repository.IUsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements IUsuarioService {
    private static final String ESTADO_ACTIVO = "A";
    private static final String ESTADO_BAJA = "B";
    private static final long PERSONA_0 = 0L;
    private static final String ROL_INQUILINO = "INQUILINO";
    private static final long USUARIO_0 = 0L;
    private final RolServiceImpl rolService;
    private final PersonaServiceImpl personaService;
    private final IUsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(RolServiceImpl rolService, PersonaServiceImpl personaService,
                              IUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.rolService = rolService;
        this.personaService = personaService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> !u.getIdUsuario().equals(USUARIO_0)
                        && !u.getRol().getRol().equalsIgnoreCase(ROL_INQUILINO))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> getUsuarioByIdUsuario(Long idUsuario) {
        if (idUsuario == USUARIO_0) {
            return Optional.empty();
        }

        return usuarioRepository.findById(idUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> getUsuarioByUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> getUsuarioByPersona(Long idPersona) throws Exception {
        Optional<Persona> personaFound = personaService.getPersonaByIdPersona(idPersona);

        if (idPersona == PERSONA_0 || personaFound.isEmpty()) {
            throw new Exception("La persona no existe");
        }

        return usuarioRepository.findByPersona(personaFound.get());
    }

    @Override
    @Transactional
    public void createUsuario(CrearPersonaDTO crearPersonaDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(crearPersonaDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Rol> rolFound = rolService.getRolByIdRol(crearPersonaDTO.getIdRol());

        if (rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        Optional<Usuario> usuarioFound = getUsuarioByUsuario(crearPersonaDTO.getUsuario());

        if (usuarioFound.isPresent()) {
            throw new Exception("El usuario ya se encuentra registrado");
        }

        Persona newPersona = personaService.createPersona(crearPersonaDTO);
        String passwordHash = passwordEncoder.encode(crearPersonaDTO.getPassword());

        usuarioRepository.save(new Usuario(rolFound.get(), newPersona, crearPersonaDTO.getUsuario(),
                passwordHash, crearPersonaDTO.getEstado(), LocalDateTime.now(),
                null, null, true));
    }

    @Override
    @Transactional
    public void updateUsuario(Long idUsuario, ActualizarPersonaDTO actualizarPersonaDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(actualizarPersonaDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Rol> rolFound = rolService.getRolByIdRol(actualizarPersonaDTO.getIdRol());

        if (rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        Usuario usuarioFound = getUsuarioByIdUsuario(idUsuario)
                .orElseThrow(() -> new Exception("El usuario no existe"));

        Persona personaFound = personaService.updatePersona(usuarioFound.getPersona().getIdPersona(),
                actualizarPersonaDTO);

        usuarioFound.setRol(rolFound.get());
        usuarioFound.setPersona(personaFound);
        usuarioFound.setUsuario(actualizarPersonaDTO.getUsuario());
        usuarioFound.setEstado(actualizarPersonaDTO.getEstado());
        usuarioFound.setFechaActualizacion(LocalDateTime.now());
        usuarioFound.setFechaBaja(null);

        usuarioRepository.save(usuarioFound);
    }

    @Override
    @Transactional
    public void updateEstadoUsuario(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(cambioEstadoDTO.getEstado());
        LocalDateTime fechaBaja = null;
        boolean isActivo = true;

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Usuario usuarioFound = getUsuarioByIdUsuario(cambioEstadoDTO.getId())
                .orElseThrow(() -> new Exception("El usuario no existe"));

        if (cambioEstadoDTO.getEstado().equals(ESTADO_BAJA)) {
            fechaBaja = LocalDateTime.now();
            isActivo = false;
        }

        usuarioFound.setEstado(cambioEstadoDTO.getEstado());
        usuarioFound.setFechaActualizacion(LocalDateTime.now());
        usuarioFound.setFechaBaja(fechaBaja);
        usuarioFound.setIsActivo(isActivo);
        usuarioRepository.save(usuarioFound);
    }
}
