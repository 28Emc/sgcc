package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarRolDTO;
import com.sgcc.sgccapi.model.DTO.CrearRolDTO;
import com.sgcc.sgccapi.model.entity.Rol;
import com.sgcc.sgccapi.model.repository.IRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RolServiceImpl implements IRolService {
    private static final long ROL_0 = 0L;
    private final IRolRepository rolRepository;

    public RolServiceImpl(IRolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rol> getAllRoles() {
        return rolRepository.findAll()
                .stream().filter(r -> !r.getIdRol().equals(ROL_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Rol> getRolByIdRol(Long idRol) {
        if (idRol == ROL_0) {
            return Optional.empty();
        }

        return rolRepository.findById(idRol);
    }

    @Override
    @Transactional
    public Rol createRol(CrearRolDTO crearRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findByRol(crearRolDTO.getRol());

        if (rolFound.isPresent()) {
            throw new Exception("El rol ya existe");
        }

        String rol = "ROLE_".concat(crearRolDTO.getRol().toUpperCase(Locale.ROOT));

        return rolRepository.save(new Rol(rol, crearRolDTO.getDescripcion(), crearRolDTO.getRuta()));
    }

    @Override
    @Transactional
    public Rol updateRol(Long idRol, ActualizarRolDTO actualizarRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findById(actualizarRolDTO.getIdRol());

        if (idRol == ROL_0 || rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        String rol = "ROLE_".concat(actualizarRolDTO.getRol().toUpperCase(Locale.ROOT));
        rolFound.get().setRol(rol);
        rolFound.get().setDescripcion(actualizarRolDTO.getDescripcion());
        rolFound.get().setRuta(actualizarRolDTO.getRuta());

        return rolRepository.save(rolFound.get());
    }
}
