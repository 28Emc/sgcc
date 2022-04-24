package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.*;
import com.sgcc.sgccapi.model.Componente;
import com.sgcc.sgccapi.model.Permiso;
import com.sgcc.sgccapi.model.Rol;
import com.sgcc.sgccapi.repository.IComponenteRepository;
import com.sgcc.sgccapi.repository.IPermisoRepository;
import com.sgcc.sgccapi.repository.IRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class PermisoServiceImpl implements IPermisoService {
    private static final String ESTADO_ACTIVO = "A";
    private static final String ESTADO_BAJA = "B";
    private static final long PERMISO_0 = 0L;
    private static final long ROL_0 = 0L;
    private final IPermisoRepository permisoRepository;
    private final IRolRepository rolRepository;
    private final IComponenteRepository componenteRepository;

    public PermisoServiceImpl(IPermisoRepository permisoRepository, IRolRepository rolRepository,
                              IComponenteRepository componenteRepository) {
        this.permisoRepository = permisoRepository;
        this.rolRepository = rolRepository;
        this.componenteRepository = componenteRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permiso> getAllPermisos() {
        return permisoRepository.findAll()
                .stream().filter(p -> !p.getIdPermiso().equals(PERMISO_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permiso> getAllPermisosByIdRol(Long idRol) throws Exception {
        Optional<Rol> rolFound = rolRepository.findById(idRol);

        if (idRol == ROL_0 || rolFound.isEmpty()) {
            throw new Exception("El rol no existe");
        }

        return permisoRepository.findAllByRol(rolFound.get())
                .stream().filter(p -> !p.getIdPermiso().equals(PERMISO_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermisosPorRolDTO> spObtenerPermisosPorRol(Long idRol) throws Exception {
        Optional<Rol> rolFound = rolRepository.findById(idRol);

        if (rolFound.isEmpty()) {
            throw new Exception("El rol no existe.");
        }

        return permisoRepository.spObtenerPermisosPorRol(idRol);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Permiso> getPermisoByIdPermiso(Long idPermiso) {
        if (idPermiso == PERMISO_0) {
            return Optional.empty();
        }

        return permisoRepository.findById(idPermiso);
    }

    @Override
    @Transactional
    public void createPermiso(CrearPermisoDTO crearPermisoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(crearPermisoDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Rol rolFound = rolRepository.findById(crearPermisoDTO.getIdRol())
                .orElseThrow(() -> new Exception("El rol no existe"));

        Componente componenteFound = componenteRepository.findById(crearPermisoDTO.getIdComponente())
                .orElseThrow(() -> new Exception("El componente no existe"));

        if (permisoRepository.findByRolAndComponente(rolFound, componenteFound).isPresent()) {
            throw new Exception("Lo sentimos, el permiso ya existe");
        }

        permisoRepository.save(new Permiso(rolFound, componenteFound, crearPermisoDTO.getEstado()));
    }

    @Override
    @Transactional
    public void updatePermiso(Long idPermiso, ActualizarPermisoDTO actualizarPermisoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(actualizarPermisoDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Permiso> permisoFound = getPermisoByIdPermiso(idPermiso);

        if (idPermiso == PERMISO_0 || permisoFound.isEmpty()) {
            throw new Exception("El permiso no existe");
        }

        Rol rolFound = rolRepository.findById(actualizarPermisoDTO.getIdRol())
                .orElseThrow(() -> new Exception("El rol no existe"));

        Componente componenteFound = componenteRepository.findById(actualizarPermisoDTO.getIdComponente())
                .orElseThrow(() -> new Exception("El componente no existe"));

        permisoFound.get().setRol(rolFound);
        permisoFound.get().setComponente(componenteFound);
        permisoFound.get().setEstado(actualizarPermisoDTO.getEstado());

        permisoRepository.save(permisoFound.get());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrCreatePermisosComponentes(PermisosComponentesDTO permisosComponentesDTO) throws Exception {
        String firstRutaDefault = "";
        Optional<Rol> rolFound = rolRepository.findById(permisosComponentesDTO.getIdRol());

        if (rolFound.isEmpty()) {
            throw new Exception("El rol no existe.");
        }

        for (PermisoComponenteItem permiso : permisosComponentesDTO.getPermisos()) {
            Optional<Permiso> permisoFound = getPermisoByIdPermiso(permiso.getIdPermiso());

            if (permisoFound.isPresent()) {
                permisoFound.get().setEstado(permiso.getEstado());
                permisoRepository.save(permisoFound.get());
            } else {
                Optional<Componente> componenteFound = componenteRepository
                        .findById(permiso.getIdComponente());

                if (componenteFound.isEmpty()) {
                    throw new Exception("El componente no existe.");
                }

                permisoRepository.save(new Permiso(rolFound.get(), componenteFound.get(), ESTADO_ACTIVO));
            }
        }

        List<PermisosPorRolDTO> permisosPorRol = spObtenerPermisosPorRol(permisosComponentesDTO.getIdRol());

        for (PermisosPorRolDTO permisoPorRol : permisosPorRol) {
            if (!permisoPorRol.getIdComponentePadre().equals(0L)
                    && permisoPorRol.getEstado().equals(ESTADO_ACTIVO)) {
                firstRutaDefault = permisoPorRol.getRuta();
                break;
            }
        }

        rolFound.get().setRuta(firstRutaDefault);
        rolRepository.save(rolFound.get());
    }

    @Override
    @Transactional
    public void updateEstadoPermiso(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(cambioEstadoDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Permiso> permisoFound = getPermisoByIdPermiso(cambioEstadoDTO.getId());

        if (cambioEstadoDTO.getId() == PERMISO_0 || permisoFound.isEmpty()) {
            throw new Exception("El permiso no existe");
        }

        permisoFound.get().setEstado(cambioEstadoDTO.getEstado());
        permisoRepository.save(permisoFound.get());
    }
}
