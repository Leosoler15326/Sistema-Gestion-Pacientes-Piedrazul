package com.SGPPiedrazul.repository;

import com.SGPPiedrazul.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Optional<Paciente> findByUsuarioId(Long usuarioId);

    List<Paciente> findTop15ByDocumentoStartingWithIgnoreCaseOrderByDocumentoAsc(String prefijo);

    Optional<Paciente> findByDocumento(String documento);

    boolean existsByDocumento(String documento);

    Optional<Paciente> findByEmail(String email);
    
}
