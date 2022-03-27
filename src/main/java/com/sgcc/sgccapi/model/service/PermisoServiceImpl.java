package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarPermisoDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearPermisoDTO;
import com.sgcc.sgccapi.model.entity.Componente;
import com.sgcc.sgccapi.model.entity.Permiso;
import com.sgcc.sgccapi.model.entity.Rol;
import com.sgcc.sgccapi.model.repository.IComponenteRepository;
import com.sgcc.sgccapi.model.repository.IPermisoRepository;
import com.sgcc.sgccapi.model.repository.IRolRepository;
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
    public Optional<Permiso> getPermisoByIdPermiso(Long idPermiso) {
        if (idPermiso == PERMISO_0) {
            return Optional.empty();
        }

        return permisoRepository.findById(idPermiso);
    }

    @Override
    @Transactional
    public Permiso createPermiso(CrearPermisoDTO crearPermisoDTO) throws Exception {
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

        return permisoRepository.save(new Permiso(rolFound, componenteFound, crearPermisoDTO.getEstado()));
    }

    @Override
    @Transactional
    public Permiso updatePermiso(Long idPermiso, ActualizarPermisoDTO actualizarPermisoDTO) throws Exception {
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

        return permisoRepository.save(permisoFound.get());
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
