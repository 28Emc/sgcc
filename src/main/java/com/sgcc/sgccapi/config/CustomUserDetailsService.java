package com.sgcc.sgccapi.config;

import com.sgcc.sgccapi.model.Usuario;
import com.sgcc.sgccapi.repository.IUsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    private final IUsuarioRepository usuarioRepository;

    public CustomUserDetailsService(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe."));
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(usuario.getRol().getRol()));
        return new User(usuario.getUsuario(), usuario.getPassword(), authorities);
    }
}
