package rabih.rajaa.projectservice.service.implementation;


import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import rabih.rajaa.projectservice.dto.ProjectDTO;
import rabih.rajaa.projectservice.entity.Project;
import rabih.rajaa.projectservice.mapper.ProjectMapper;
import rabih.rajaa.projectservice.repository.ProjectRepository;
import rabih.rajaa.projectservice.service.ProjectServicee;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class ProjectServiceImpl implements ProjectServicee {


    private final ProjectRepository repository;
    private final ProjectMapper mapper;


    public ProjectServiceImpl(ProjectRepository repository, ProjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }


    @Override
    public ProjectDTO create(ProjectDTO dto) {
        Project project = mapper.toEntity(dto);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        return mapper.toDTO(repository.save(project));
    }


    @Override
    public Page<ProjectDTO> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDTO);
    }


    @Override
    public ProjectDTO getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public Page<ProjectDTO> search(String title, String description, String status, String priority, Pageable pageable) {
        return repository.findWithFilters(title, description, status, priority, pageable).map(mapper::toDTO);
    }

    @Override
    public ProjectDTO update(Long id, ProjectDTO dto) {
        Project existingProject = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        mapper.updateEntity(dto, existingProject);
        existingProject.setUpdatedAt(LocalDateTime.now());
        return mapper.toDTO(repository.save(existingProject));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        repository.deleteById(id);
    }
}
