package com.sgcc.sgccapi.config;

import com.sgcc.sgccapi.dto.UsuarioDTO;
import com.sgcc.sgccapi.repository.IUsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final IUsuarioRepository usuarioRepository;

    public CustomUserDetailsService(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Buscando a usuario: " + username);
        UsuarioDTO usuario = usuarioRepository.validateUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe."));
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(usuario.getRol()));
        log.info("Usuario encontrado!");
        log.info("* Usuario: " + usuario.getUsuario());
        log.info("* Password: " + usuario.getPassword());
        log.info("* Roles: " + authorities);
        return new User(usuario.getUsuario(), usuario.getPassword(), authorities);
    }
}
