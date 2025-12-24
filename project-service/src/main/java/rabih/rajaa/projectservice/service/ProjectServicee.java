package rabih.rajaa.projectservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rabih.rajaa.projectservice.dto.ProjectDTO;

public interface ProjectServicee {
    ProjectDTO create(ProjectDTO dto);
    Page<ProjectDTO> getAll(Pageable pageable);
    Page<ProjectDTO> search(String title, String description, String status, String priority, Pageable pageable);
    ProjectDTO getById(Long id);
    ProjectDTO update(Long id, ProjectDTO dto);
    void delete(Long id);
}

