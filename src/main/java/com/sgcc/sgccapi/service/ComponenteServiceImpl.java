package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.CambioEstadoDTO;
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
public class ComponenteServiceImpl implements IComponenteService {
    private static final String ESTADO_ACTIVO = "A";
    private static final String ESTADO_BAJA = "B";
    private static final long COMPONENTE_0 = 0L;
    private static final long ROL_0 = 0L;
    private static final long PERMISO_0 = 0L;
    private final IComponenteRepository componenteRepository;
    private final IPermisoRepository permisoRepository;
    private final IRolRepository rolRepository;

    public ComponenteServiceImpl(IComponenteRepository componenteRepository,
                                 IPermisoRepository permisoRepository,
                                 IRolRepository rolRepository) {
        this.componenteRepository = componenteRepository;
        this.permisoRepository = permisoRepository;
        this.rolRepository = rolRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Componente> getAllComponentes() {
        return componenteRepository.findAll()
                .stream().filter(c -> !c.getIdComponente().equals(COMPONENTE_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Componente> getAllComponentesByIdComponentePadre(Long idComponentePadre) {
        return componenteRepository.findAllByIdComponentePadre(idComponentePadre)
                .stream().filter(c -> !c.getIdComponente().equals(COMPONENTE_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Componente> getComponenteByIdComponente(Long idComponente) {
        if (idComponente == COMPONENTE_0) {
            return Optional.empty();
        }

        return componenteRepository.findById(idComponente);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createComponente(Componente componente) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(componente.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        if (componenteRepository.findByComponenteOrRuta(componente.getComponente(),
                componente.getRuta()).isPresent()) {
            throw new Exception("Lo sentimos, el componente ya existe");
        }

        componenteRepository.save(componente);
        createPermisoOnComponente(componente);
    }

    private void createPermisoOnComponente(Componente componente) throws Exception {
        List<Rol> roles = rolRepository.findAll()
                .stream()
                .filter(rol -> !rol.getIdRol().equals(ROL_0))
                .collect(Collectors.toList());

        if (roles.isEmpty()) {
            throw new Exception("Lo sentimos, no se encontraron roles válidos.");
        }

        roles.stream().filter(rol -> !rol.getIdRol().equals(ROL_0))
                .forEach(rol -> permisoRepository.save(new Permiso(rol, componente, ESTADO_BAJA)));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateComponente(Long idComponente, Componente componente) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(componente.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Componente> componenteFound = getComponenteByIdComponente(idComponente);

        if (idComponente == COMPONENTE_0 || componenteFound.isEmpty()) {
            throw new Exception("El componente no existe");
        }

        componenteFound.get().setIdComponentePadre(componente.getIdComponentePadre());
        componenteFound.get().setComponente(componente.getComponente());
        componenteFound.get().setDescripcion(componente.getDescripcion());
        componenteFound.get().setIcono(componente.getIcono());
        componenteFound.get().setRuta(componente.getRuta());
        componenteFound.get().setOrden(componente.getOrden());
        componenteFound.get().setEstado(componente.getEstado());

        componenteRepository.save(componenteFound.get());
        updateEstadoPermisoOnComponente(componenteFound.get());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateEstadoComponente(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Pattern p = Pattern.compile(ESTADO_ACTIVO.concat("|").concat(ESTADO_BAJA));
        Matcher m = p.matcher(cambioEstadoDTO.getEstado());

        if (!m.matches()) {
            throw new Exception("Lo sentimos, el estado es inválido. Valores permitidos: "
                    .concat(ESTADO_ACTIVO).concat(", ").concat(ESTADO_BAJA));
        }

        Optional<Componente> componenteFound = getComponenteByIdComponente(cambioEstadoDTO.getId());

        if (cambioEstadoDTO.getId() == COMPONENTE_0 || componenteFound.isEmpty()) {
            throw new Exception("El componente no existe");
        }

        componenteFound.get().setEstado(cambioEstadoDTO.getEstado());

        componenteRepository.save(componenteFound.get());
        updateEstadoPermisoOnComponente(componenteFound.get());
    }

    private void updateEstadoPermisoOnComponente(Componente componente) throws Exception {
        List<Permiso> permisos = permisoRepository.findAllByComponente(componente)
                .stream()
                .filter(permiso -> !permiso.getIdPermiso().equals(PERMISO_0))
                .collect(Collectors.toList());

        if (permisos.isEmpty()) {
            throw new Exception("Lo sentimos, no se encontraron permisos válidos.");
        }

        permisos.forEach(permiso -> permiso.setEstado(componente.getEstado()));
        permisoRepository.saveAll(permisos);
    }
}
