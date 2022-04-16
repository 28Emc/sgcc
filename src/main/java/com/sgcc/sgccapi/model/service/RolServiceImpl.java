package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarRolDTO;
import com.sgcc.sgccapi.model.DTO.CrearRolDTO;
import com.sgcc.sgccapi.model.DTO.PermisosPorRolDTO;
import com.sgcc.sgccapi.model.entity.Permiso;
import com.sgcc.sgccapi.model.entity.Rol;
import com.sgcc.sgccapi.model.repository.IPermisoRepository;
import com.sgcc.sgccapi.model.repository.IRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RolServiceImpl implements IRolService {
    private static final long ROL_0 = 0L;
    private static final String ROL_ADMIN = "admin";
    private static final String ESTADO_BAJA = "B";
    private final IRolRepository rolRepository;
    private final IPermisoRepository permisoRepository;

    public RolServiceImpl(IRolRepository rolRepository, IPermisoRepository permisoRepository) {
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rol> getAllRoles() {
        return rolRepository.findAll()
                .stream()
                .filter(r -> !r.getIdRol().equals(ROL_0))
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
    @Transactional(rollbackFor = Exception.class)
    public Rol createRol(CrearRolDTO crearRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findByRol(crearRolDTO.getRol());

        if (rolFound.isPresent()) {
            throw new Exception("El rol ya existe");
        }

        Rol newRol = rolRepository.save(new Rol(crearRolDTO.getRol().toUpperCase(),
                crearRolDTO.getDescripcion(), crearRolDTO.getRuta()));

        grantPermisosToCreatedRol(newRol);

        return newRol;
    }

    @Transactional(rollbackFor = Exception.class)
    protected void grantPermisosToCreatedRol(Rol rol) {
        try {
            String firstRutaDefault = "";
            Optional<Rol> rolAdmin = rolRepository.findByRolIgnoreCaseContaining(ROL_ADMIN);

            if (rolAdmin.isEmpty()) {
                throw new Exception("El rol de administrador no existe.");
            }

            List<Permiso> permisosAdmin = permisoRepository.findAllByRol(rolAdmin.get());

            if (permisosAdmin.isEmpty()) {
                throw new Exception("El rol de administrador no tiene permisos asignados.");
            }

            for (Permiso permiso : permisosAdmin) {
                permisoRepository.save(new Permiso(rol, permiso.getComponente(), ESTADO_BAJA));
            }

            List<PermisosPorRolDTO> permisosPorRol = permisoRepository.spObtenerPermisosPorRol(rol.getIdRol());

            if (permisosPorRol.isEmpty()) {
                throw new Exception("El rol actual no tiene permisos asignados.");
            }

            for (PermisosPorRolDTO permisoPorRol : permisosPorRol) {
                if (!permisoPorRol.getIdComponentePadre().equals(0L)) {
                    firstRutaDefault = permisoPorRol.getRuta();
                }
                break;
            }

            rol.setRuta(firstRutaDefault); // FIXME: REVISAR PORQUE NO SE ASIGNA LA RUTA POR DEFECTO AL CREAR UN ROL.
            rolRepository.save(rol);
        } catch (Exception e) {
            System.out.println("e = " + e.getMessage());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Rol updateRol(Long idRol, ActualizarRolDTO actualizarRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findById(actualizarRolDTO.getIdRol());

        if (idRol == ROL_0 || rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        rolFound.get().setRol(actualizarRolDTO.getRol().toUpperCase());
        rolFound.get().setDescripcion(actualizarRolDTO.getDescripcion());
        //rolFound.get().setRuta(actualizarRolDTO.getRuta());

        return rolRepository.save(rolFound.get());
    }
}
