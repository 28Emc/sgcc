package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarRolDTO;
import com.sgcc.sgccapi.dto.CrearRolDTO;
import com.sgcc.sgccapi.dto.PermisosPorRolDTO;
import com.sgcc.sgccapi.model.Componente;
import com.sgcc.sgccapi.model.Permiso;
import com.sgcc.sgccapi.model.Rol;
import com.sgcc.sgccapi.repository.IComponenteRepository;
import com.sgcc.sgccapi.repository.IPermisoRepository;
import com.sgcc.sgccapi.repository.IRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.sgcc.sgccapi.constant.ServiceConstants.*;

@Service
public class RolServiceImpl implements IRolService {

    private final IRolRepository rolRepository;
    private final IPermisoRepository permisoRepository;

    private final IComponenteRepository componenteRepository;

    public RolServiceImpl(IRolRepository rolRepository,
                          IPermisoRepository permisoRepository,
                          IComponenteRepository componenteRepository) {
        this.rolRepository = rolRepository;
        this.permisoRepository = permisoRepository;
        this.componenteRepository = componenteRepository;
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
    public void createRol(CrearRolDTO crearRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findByRol(crearRolDTO.getRol());

        if (rolFound.isPresent()) {
            throw new Exception("El rol ya existe");
        }

        Rol newRol = rolRepository.save(new Rol(crearRolDTO.getRol().toUpperCase(),
                crearRolDTO.getDescripcion(), crearRolDTO.getRuta()));

        grantPermisosToCreatedRol(newRol);
    }

    @Transactional
    protected void grantPermisosToCreatedRol(Rol rol) throws Exception {
        String firstRutaDefault = "";
        List<Permiso> permisosTemp = new ArrayList<>();
        Optional<Rol> rolAdmin = rolRepository.findByRolIgnoreCaseContaining(ROL_ADMIN_UPPERCASE);

        if (rolAdmin.isEmpty()) {
            throw new Exception("El rol de administrador no existe.");
        }

        List<Permiso> permisosAdmin = permisoRepository.findAllByRol(rolAdmin.get());

        if (permisosAdmin.isEmpty()) {
            throw new Exception("El rol de administrador no tiene permisos asignados.");
        }

        for (Permiso permiso : permisosAdmin) {
            permisosTemp.add(new Permiso(rol, permiso.getComponente(), ESTADO_BAJA));
        }

        permisoRepository.saveAll(permisosTemp);

        List<PermisosPorRolDTO> permisosPorRol = permisoRepository.spObtenerPermisosPorRol(rol.getIdRol());

        if (permisosPorRol.isEmpty()) {
            throw new Exception("El rol actual no tiene permisos asignados.");
        }

        for (PermisosPorRolDTO permisoPorRol : permisosPorRol) {
            if (!permisoPorRol.getIdComponentePadre().equals(0L)
                    && permisoPorRol.getEstado().equals(ESTADO_ACTIVO)) {
                firstRutaDefault = permisoPorRol.getRuta();
                break;
            }
        }

        rol.setRuta(firstRutaDefault);
        rolRepository.save(rol);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateRol(Long idRol, ActualizarRolDTO actualizarRolDTO) throws Exception {
        Optional<Rol> rolFound = rolRepository.findById(actualizarRolDTO.getIdRol());

        if (idRol == ROL_0 || rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        rolFound.get().setRol(actualizarRolDTO.getRol().toUpperCase());
        rolFound.get().setDescripcion(actualizarRolDTO.getDescripcion());

        rolRepository.save(rolFound.get());

        grantPermisosToUpdatedRol(rolFound.get());
    }

    @Transactional
    protected void grantPermisosToUpdatedRol(Rol rol) throws Exception {
        List<Long> idComponentesPermisosByRol = permisoRepository
                .findAllByRol(rol)
                .stream()
                .map(p -> p.getComponente().getIdComponente())
                .collect(Collectors.toList());

        if (idComponentesPermisosByRol.isEmpty()) {
            throw new Exception("No hay permisos para el rol especificado.");
        }

        List<Componente> componentesWithoutPermisos = componenteRepository
                .findByIdComponenteNotIn(idComponentesPermisosByRol)
                .stream()
                .filter(c -> !c.getIdComponente().equals(COMPONENTE_0))
                .collect(Collectors.toList());

        if (!componentesWithoutPermisos.isEmpty()) {
            List<Permiso> newPermisos = new ArrayList<>();

            for (Componente componente : componentesWithoutPermisos) {
                newPermisos.add(new Permiso(rol, componente, ESTADO_BAJA));
            }

            permisoRepository.saveAll(newPermisos);
        }
    }
}
