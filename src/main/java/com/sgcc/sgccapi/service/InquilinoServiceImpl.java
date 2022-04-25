package com.sgcc.sgccapi.service;

import com.sgcc.sgccapi.dto.*;
import com.sgcc.sgccapi.model.Inquilino;
import com.sgcc.sgccapi.model.Persona;
import com.sgcc.sgccapi.model.Rol;
import com.sgcc.sgccapi.model.Usuario;
import com.sgcc.sgccapi.repository.IInquilinoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InquilinoServiceImpl implements IInquilinoService {
    private static final String ESTADO_BAJA = "B";
    private static final String ROL_INQUILINO = "INQUILINO";
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
    public List<ListaInquilinosDTO> getAllInquilinosDetail() {
        return inquilinoRepository.findAllInquilinosUsuarioPersona();
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
    public void createUsuarioInquilino(CrearInquilinoDTO crearInquilinoDTO) throws Exception {
        Optional<Rol> rolFound = rolService.getRolByIdRol(crearInquilinoDTO.getIdRol());

        if (rolFound.isEmpty() || !rolFound.get().getRol().equals(ROL_INQUILINO)) {
            throw new Exception("El rol seleccionado es inválido");
        }

        usuarioService.createUsuario(new CrearPersonaDTO(crearInquilinoDTO.getTipoDocumento(),
                crearInquilinoDTO.getNroDocumento(), crearInquilinoDTO.getGenero(), crearInquilinoDTO.getNombres(),
                crearInquilinoDTO.getApellidoPaterno(), crearInquilinoDTO.getApellidoMaterno(),
                crearInquilinoDTO.getDireccion(), crearInquilinoDTO.getTelefono(), crearInquilinoDTO.getEmail(),
                crearInquilinoDTO.getIdRol(), crearInquilinoDTO.getUsuario(), crearInquilinoDTO.getPassword(),
                crearInquilinoDTO.getEstado()));

        Usuario createdUsuario = usuarioService.getUsuarioByUsuario(crearInquilinoDTO.getUsuario())
                .orElseThrow(() -> new Exception("El usuario no existe."));

        inquilinoRepository.save(new Inquilino(createdUsuario.getPersona(),
                crearInquilinoDTO.getFechaInicioContrato()));
    }

    @Override
    @Transactional
    public void updateUsuarioInquilino(Long idInquilino, ActualizarInquilinoDTO actualizarInquilinoDTO)
            throws Exception {
        Optional<Rol> rolFound = rolService.getRolByIdRol(actualizarInquilinoDTO.getIdRol());

        if (rolFound.isEmpty() || !rolFound.get().getRol().equals(ROL_INQUILINO)) {
            throw new Exception("El rol seleccionado es inválido");
        }

        Inquilino inquilinoFound = getInquilinoByIdInquilino(idInquilino)
                .orElseThrow(() -> new Exception("El inquilino no existe"));

        usuarioService.updateUsuario(actualizarInquilinoDTO.getIdUsuario(),
                new ActualizarPersonaDTO(actualizarInquilinoDTO.getTipoDocumento(),
                        actualizarInquilinoDTO.getNroDocumento(), actualizarInquilinoDTO.getGenero(),
                        actualizarInquilinoDTO.getNombres(), actualizarInquilinoDTO.getApellidoPaterno(),
                        actualizarInquilinoDTO.getApellidoMaterno(), actualizarInquilinoDTO.getDireccion(),
                        actualizarInquilinoDTO.getTelefono(), actualizarInquilinoDTO.getEmail(),
                        actualizarInquilinoDTO.getIdRol(), actualizarInquilinoDTO.getIdUsuario(),
                        actualizarInquilinoDTO.getUsuario(), actualizarInquilinoDTO.getEstado()));

        Usuario updatedUsuario = usuarioService.getUsuarioByUsuario(actualizarInquilinoDTO.getUsuario())
                .orElseThrow(() -> new Exception("El usuario no existe."));

        inquilinoFound.setPersona(updatedUsuario.getPersona());
        inquilinoFound.setFechaInicioContrato(actualizarInquilinoDTO.getFechaInicioContrato());
        inquilinoFound.setFechaFinContrato(actualizarInquilinoDTO.getFechaFinContrato());

        inquilinoRepository.save(inquilinoFound);
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
