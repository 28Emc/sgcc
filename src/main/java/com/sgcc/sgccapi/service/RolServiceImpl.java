package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.ActualizarRolDTO;
import com.sgcc.sgccapi.dto.ComponenteDTO;
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

        Rol newRol = rolRepository.save(new Rol(crearRolDTO.getRol(),
                crearRolDTO.getDescripcion(), crearRolDTO.getRuta()));

        grantPermisosToCreatedRol(newRol, crearRolDTO.getComponentes());
    }

    @Transactional
    protected void grantPermisosToCreatedRol(Rol rol, List<ComponenteDTO> componentes) throws Exception {
        String firstRutaDefault = "";
        List<Permiso> permisosTemp = new ArrayList<>();

        List<Componente> componentesList = componenteRepository.findAll()
                .stream()
                .filter(c -> !c.getIdComponente().equals(COMPONENTE_0))
                .toList();

        for (ComponenteDTO componente : componentes) {
            componentesList.stream()
                    .filter(c -> c.getIdComponente().equals(componente.getIdComponente()))
                    .findFirst()
                    .ifPresent(c -> permisosTemp.add(new Permiso(rol, c,
                            componente.getEstado().equals(ESTADO_ACTIVO) ? ESTADO_ACTIVO : ESTADO_BAJA)));
        }

        permisoRepository.saveAll(permisosTemp);

        for (Permiso permisoPorRol : permisosTemp) {
            if (!permisoPorRol.getComponente().getIdComponentePadre().equals(0L)
                    && permisoPorRol.getEstado().equals(ESTADO_ACTIVO)) {
                firstRutaDefault = permisoPorRol.getComponente().getRuta();
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

        rolFound.get().setRol(actualizarRolDTO.getRol());
        rolFound.get().setDescripcion(actualizarRolDTO.getDescripcion());

        rolRepository.save(rolFound.get());

        grantPermisosToUpdatedRol(rolFound.get(), actualizarRolDTO.getComponentes());
    }

    @Transactional
    protected void grantPermisosToUpdatedRol(Rol rol, List<ComponenteDTO> componentes) throws Exception {
        String firstRutaDefault = "";
        List<Permiso> permisosByRol = permisoRepository.findAllByRol(rol);

        for (Permiso permiso : permisosByRol) {
            componentes.stream()
                    .filter(c -> c.getIdComponente().equals(permiso.getComponente().getIdComponente()))
                    .findFirst()
                    .ifPresent(c -> permiso.setEstado(c.getEstado()));
        }

        permisoRepository.saveAll(permisosByRol);

        for (Permiso permisoPorRol : permisosByRol) {
            if (!permisoPorRol.getComponente().getIdComponentePadre().equals(0L)
                    && permisoPorRol.getEstado().equals(ESTADO_ACTIVO)) {
                firstRutaDefault = permisoPorRol.getComponente().getRuta();
                break;
            }
        }

        rol.setRuta(firstRutaDefault);
        rolRepository.save(rol);
    }
}
