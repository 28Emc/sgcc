package com.sgcc.sgccapi.model.service;

import com.sgcc.sgccapi.model.DTO.ActualizarPersonaDTO;
import com.sgcc.sgccapi.model.DTO.CrearPersonaDTO;
import com.sgcc.sgccapi.model.entity.Persona;
import com.sgcc.sgccapi.model.repository.IPersonaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonaServiceImpl implements IPersonaService {
    private static final long PERSONA_0 = 0L;
    private final IPersonaRepository personaRepository;

    public PersonaServiceImpl(IPersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Persona> getAllPersonas() {
        return personaRepository.findAll()
                .stream().filter(p -> !p.getIdPersona().equals(PERSONA_0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Persona> getPersonaByIdPersona(Long idPersona) {
        if (idPersona == PERSONA_0) {
            return Optional.empty();
        }

        return personaRepository.findById(idPersona);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Persona> getPersonaByNroDocumento(String nroDocumento) {
        return personaRepository.findByNroDocumento(nroDocumento);
    }

    @Override
    @Transactional
    public Persona createPersona(CrearPersonaDTO crearPersonaDTO) throws Exception {
        Optional<Persona> personaFound = getPersonaByNroDocumento(crearPersonaDTO.getNroDocumento());

        if (personaFound.isPresent()) {
            throw new Exception("La persona ya se encuentra registrada");
        }

        return personaRepository.save(new Persona(crearPersonaDTO.getTipoDocumento(),
                crearPersonaDTO.getNroDocumento(), crearPersonaDTO.getGenero(),
                crearPersonaDTO.getNombres(), crearPersonaDTO.getApellidoPaterno(),
                crearPersonaDTO.getApellidoMaterno(), crearPersonaDTO.getDireccion(),
                crearPersonaDTO.getTelefono(), crearPersonaDTO.getEmail()));
    }

    @Override
    @Transactional
    public Persona updatePersona(Long idPersona, ActualizarPersonaDTO actualizarPersonaDTO) throws Exception {
        Optional<Persona> personaFound = personaRepository.findById(idPersona);

        if (idPersona == PERSONA_0 || personaFound.isEmpty()) {
            throw new Exception("Lo sentimos, la persona no existe");
        }

        personaFound.get().setTipoDocumento(actualizarPersonaDTO.getTipoDocumento());
        personaFound.get().setNroDocumento(actualizarPersonaDTO.getNroDocumento());
        personaFound.get().setGenero(actualizarPersonaDTO.getGenero());
        personaFound.get().setNombres(actualizarPersonaDTO.getNombres());
        personaFound.get().setApellidoPaterno(actualizarPersonaDTO.getApellidoPaterno());
        personaFound.get().setApellidoMaterno(actualizarPersonaDTO.getApellidoMaterno());
        personaFound.get().setDireccion(actualizarPersonaDTO.getDireccion());
        personaFound.get().setTelefono(actualizarPersonaDTO.getTelefono());
        personaFound.get().setEmail(actualizarPersonaDTO.getEmail());

        return personaRepository.save(personaFound.get());
    }
}
