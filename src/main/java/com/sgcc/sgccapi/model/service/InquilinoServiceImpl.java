package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.*;
import com.sgcc.sgccapi.model.entity.Inquilino;
import com.sgcc.sgccapi.model.entity.Persona;
import com.sgcc.sgccapi.model.entity.Rol;
import com.sgcc.sgccapi.model.entity.Usuario;
import com.sgcc.sgccapi.model.repository.IInquilinoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InquilinoServiceImpl implements IInquilinoService {
    private static final String ESTADO_BAJA = "B";
    private static final String ROL_INQUILINO = "ROLE_INQUILINO";
    private static final long INQUILINO_O = 0L;
    private final RolServiceImpl rolService;
    private final PersonaServiceImpl personaService;
    private final UsuarioServiceImpl usuarioService;
    private final IInquilinoRepository inquilinoRepository;

    public InquilinoServiceImpl(RolServiceImpl rolService, PersonaServiceImpl personaService,
                                UsuarioServiceImpl usuarioService, IInquilinoRepository inquilinoRepository) {
        this.rolService = rolService;
        this.personaService = personaService;
        this.usuarioService = usuarioService;
        this.inquilinoRepository = inquilinoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Inquilino> getAllInquilinos() {
        return inquilinoRepository.findAll()
                .stream().filter(i -> !i.getIdInquilino().equals(INQUILINO_O))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Inquilino> getInquilinoByIdInquilino(Long idInquilino) {
        if (idInquilino == INQUILINO_O) {
            return Optional.empty();
        }

        return inquilinoRepository.findById(idInquilino);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Inquilino> getInquilinoByIdPersona(Long idPersona) throws Exception {
        Optional<Persona> personaFound = personaService.getPersonaByIdPersona(idPersona);

        if (idPersona == INQUILINO_O || personaFound.isEmpty()) {
            throw new Exception("La persona no existe");
        }

        return inquilinoRepository.findByPersona(personaFound.get());
    }

    @Override
    @Transactional
    public Inquilino createUsuarioInquilino(CrearInquilinoDTO crearInquilinoDTO) throws Exception {
        Optional<Rol> rolFound = rolService.getRolByIdRol(crearInquilinoDTO.getIdRol());

        if (rolFound.isEmpty() || !rolFound.get().getRol().equals(ROL_INQUILINO)) {
            throw new Exception("El rol seleccionado es inválido");
        }

        Usuario newUsuario = usuarioService.createUsuario(new CrearPersonaDTO(crearInquilinoDTO.getTipoDocumento(),
                crearInquilinoDTO.getNroDocumento(), crearInquilinoDTO.getGenero(), crearInquilinoDTO.getNombres(),
                crearInquilinoDTO.getApellidoPaterno(), crearInquilinoDTO.getApellidoMaterno(),
                crearInquilinoDTO.getDireccion(), crearInquilinoDTO.getTelefono(), crearInquilinoDTO.getEmail(),
                crearInquilinoDTO.getIdRol(), crearInquilinoDTO.getUsuario(), crearInquilinoDTO.getPassword(),
                crearInquilinoDTO.getEstado()));

        return inquilinoRepository.save(new Inquilino(newUsuario.getPersona(),
                crearInquilinoDTO.getFechaInicioContrato()));
    }

    @Override
    @Transactional
    public Inquilino updateUsuarioInquilino(Long idInquilino, ActualizarInquilinoDTO actualizarInquilinoDTO)
            throws Exception {
        Optional<Rol> rolFound = rolService.getRolByIdRol(actualizarInquilinoDTO.getIdRol());

        if (rolFound.isEmpty() || !rolFound.get().getRol().equals(ROL_INQUILINO)) {
            throw new Exception("El rol seleccionado es inválido");
        }

        Inquilino inquilinoFound = getInquilinoByIdInquilino(idInquilino)
                .orElseThrow(() -> new Exception("El inquilino no existe"));

        Usuario updatedUsuario = usuarioService.updateUsuario(actualizarInquilinoDTO.getIdUsuario(),
                new ActualizarPersonaDTO(actualizarInquilinoDTO.getTipoDocumento(),
                        actualizarInquilinoDTO.getNroDocumento(), actualizarInquilinoDTO.getGenero(),
                        actualizarInquilinoDTO.getNombres(), actualizarInquilinoDTO.getApellidoPaterno(),
                        actualizarInquilinoDTO.getApellidoMaterno(), actualizarInquilinoDTO.getDireccion(),
                        actualizarInquilinoDTO.getTelefono(), actualizarInquilinoDTO.getEmail(),
                        actualizarInquilinoDTO.getIdRol(), actualizarInquilinoDTO.getIdUsuario(),
                        actualizarInquilinoDTO.getUsuario(), actualizarInquilinoDTO.getEstado()));
        inquilinoFound.setPersona(updatedUsuario.getPersona());
        inquilinoFound.setFechaFinContrato(actualizarInquilinoDTO.getFechaFinContrato());

        return inquilinoRepository.save(inquilinoFound);
    }

    @Override
    @Transactional
    public void updateEstadoUsuarioInquilino(CambioEstadoDTO cambioEstadoDTO) throws Exception {
        Inquilino inquilinoFound = getInquilinoByIdInquilino(cambioEstadoDTO.getId())
                .orElseThrow(() -> new Exception("El inquilino no existe"));
        LocalDateTime fechaFinContrato = null;

        if (cambioEstadoDTO.getEstado().equals(ESTADO_BAJA)) {
            fechaFinContrato = LocalDateTime.now();
        }

        inquilinoFound.setFechaFinContrato(fechaFinContrato);
        inquilinoRepository.save(inquilinoFound);

        Usuario usuarioFound = usuarioService.getUsuarioByPersona(inquilinoFound.getPersona().getIdPersona())
                .orElseThrow(() -> new Exception("El usuario no existe con el id persona especificado"));
        cambioEstadoDTO.setId(usuarioFound.getIdUsuario());

        usuarioService.updateEstadoUsuario(cambioEstadoDTO);
    }
}
