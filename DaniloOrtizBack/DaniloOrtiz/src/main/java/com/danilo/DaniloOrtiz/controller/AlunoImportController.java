package com.danilo.DaniloOrtiz.controller;

import com.danilo.DaniloOrtiz.model.Aluno;
import com.danilo.DaniloOrtiz.model.dto.ImportResultDTO;
import com.danilo.DaniloOrtiz.service.AlunoImportService;
import com.danilo.DaniloOrtiz.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/import/")
@RequiredArgsConstructor
public class AlunoImportController {
    private final AlunoService alunoService;
    private final AlunoImportService alunoImportService;

    @PostMapping("/admin/importar-planilha")
    public ResponseEntity<?> importarPlanilha(@RequestParam("file") MultipartFile file,
                                              Authentication authentication) {
        String email = authentication.getName();
        Optional<Aluno> administradorOpt = alunoService.findByEmail(email);

        if (!"ADMIN".equals(administradorOpt.get().getTipoUsuario())) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ImportResultDTO resultado = alunoImportService.importar(file, administradorOpt.get());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Erro ao processar planilha: " + e.getMessage());
        }
    }
}
